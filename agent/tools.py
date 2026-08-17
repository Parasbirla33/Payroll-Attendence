"""LangChain tools exposed to the chat agent. Every tool is a thin wrapper
around db/crud.py or services/*, so agent answers are grounded in real data
rather than hallucinated. Employee-identifying tools take free-text and
resolve it via crud.resolve_employees, returning a clear message instead of
raising when an employee is not found or the query is ambiguous."""
from __future__ import annotations

import random
from datetime import date, datetime, time as dtime, timedelta

from langchain_core.tools import tool

from db import crud
from db.models import AttendanceStatus, Employee
from services import payroll as payroll_service
from services.payslip_generator import generate_pdf as render_payslip_pdf


def _resolve_single(employee_query: str) -> tuple[Employee | None, str | None]:
    matches = crud.resolve_employees(employee_query)
    if not matches:
        return None, f"No employee found matching '{employee_query}'."
    if len(matches) > 1:
        names = ", ".join(f"{e.full_name} ({e.employee_code})" for e in matches)
        return None, f"'{employee_query}' is ambiguous — matches: {names}. Please be more specific."
    return matches[0], None


@tool
def list_employees(active_only: bool = True) -> str:
    """List employees. Set active_only=False to include deactivated employees."""
    employees = crud.list_employees(active_only=active_only)
    if not employees:
        return "No employees found."
    return "\n".join(
        f"{e.employee_code} — {e.full_name} ({e.designation or 'n/a'}, {e.department or 'n/a'}), "
        f"base salary: {e.base_salary}"
        for e in employees
    )


@tool
def count_employees(active_only: bool = True) -> str:
    """Count employees. Set active_only=False to include deactivated employees.
    Use this instead of counting the results of list_employees yourself."""
    return str(crud.count_employees(active_only=active_only))


@tool
def get_employee_info(query: str) -> str:
    """Look up an employee's profile by name or employee code."""
    employee, error = _resolve_single(query)
    if error:
        return error
    return (
        f"Name: {employee.full_name}\nCode: {employee.employee_code}\n"
        f"Designation: {employee.designation or 'n/a'}\nDepartment: {employee.department or 'n/a'}\n"
        f"Base salary: {employee.base_salary}\nActive: {employee.active}"
    )


@tool
def register_employee(
    full_name: str,
    employee_code: str,
    base_salary: float,
    designation: str = "",
    department: str = "",
    email: str = "",
    phone: str = "",
) -> str:
    """Create a new employee profile (metadata only — face photos must still
    be captured via the Employee Enrollment page's camera)."""
    if crud.get_employee_by_code(employee_code):
        return f"An employee with code {employee_code} already exists. Choose a different employee_code."
    employee = crud.create_employee(
        employee_code=employee_code,
        full_name=full_name,
        base_salary=base_salary,
        designation=designation or None,
        department=department or None,
        email=email or None,
        phone=phone or None,
    )
    return (
        f"Created employee {employee.full_name} ({employee.employee_code}). "
        "Face photos still need to be captured on the Employee Enrollment page before "
        "attendance can be recognized for them."
    )


@tool
def get_attendance_summary(employee_query: str, start_date: str, end_date: str) -> str:
    """Summarize an employee's attendance between two dates (YYYY-MM-DD format)."""
    employee, error = _resolve_single(employee_query)
    if error:
        return error
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        return "Dates must be in YYYY-MM-DD format."

    records = crud.get_attendance_records(
        employee_ids=[employee.id], start_date=start, end_date=end
    )
    if not records:
        return f"No attendance records for {employee.full_name} between {start_date} and {end_date}."
    present = sum(1 for r in records if r.status.value in ("present", "late"))
    late = sum(1 for r in records if r.status.value == "late")
    return (
        f"{employee.full_name}: {present} present day(s) out of {len(records)} recorded "
        f"({late} of those late) between {start_date} and {end_date}."
    )


@tool
def get_daily_attendance(on_date: str) -> str:
    """List who was present/late that day (YYYY-MM-DD format)."""
    try:
        day = datetime.strptime(on_date, "%Y-%m-%d").date()
    except ValueError:
        return "Date must be in YYYY-MM-DD format."

    records = crud.get_attendance_on_date_all(day)
    if not records:
        return f"No attendance records for {on_date}."
    all_employees = {e.id: e for e in crud.list_employees(active_only=False)}
    present_ids = {r.employee_id for r in records}
    lines = []
    for r in records:
        emp = all_employees.get(r.employee_id)
        name = emp.full_name if emp else f"employee #{r.employee_id}"
        lines.append(f"{name}: {r.status.value}")
    absent = [e.full_name for e in all_employees.values() if e.active and e.id not in present_ids]
    if absent:
        lines.append(f"Not marked / absent: {', '.join(absent)}")
    return "\n".join(lines)


@tool
def seed_demo_attendance(
    employee_query: str, start_date: str, end_date: str, present_probability: float = 0.85
) -> str:
    """Admin/testing utility: bulk-generate randomized attendance for ONE employee
    across a date range (YYYY-MM-DD), for demo/testing data only — never use this
    for real attendance. present_probability (0-1) is the chance each day in the
    range gets marked present/late; the rest are left as absences (no record).
    Days that already have a record are left untouched."""
    employee, error = _resolve_single(employee_query)
    if error:
        return error
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        return "Dates must be in YYYY-MM-DD format."
    if not (0 <= present_probability <= 1):
        return "present_probability must be between 0 and 1."
    if start > end:
        return "start_date must be on or before end_date."

    created = 0
    d = start
    while d <= end:
        if crud.get_attendance_for_date(employee.id, d) is None and random.random() < present_probability:
            is_late = random.random() < 0.1
            status = AttendanceStatus.late if is_late else AttendanceStatus.present
            check_in = datetime.combine(d, dtime(10 if is_late else 9, random.randint(0, 45)))
            check_out = datetime.combine(d, dtime(18, random.randint(0, 45)))
            crud.upsert_attendance(
                employee_id=employee.id, on_date=d, check_in=check_in, check_out=check_out, status=status,
            )
            created += 1
        d += timedelta(days=1)
    return f"Seeded {created} demo attendance day(s) for {employee.full_name} between {start_date} and {end_date}."


@tool
def compute_payroll_preview(employee_query: str, month: int, year: int) -> str:
    """Preview an employee's payroll for a given month/year WITHOUT saving it
    or generating a PDF."""
    employee, error = _resolve_single(employee_query)
    if error:
        return error
    result = payroll_service.calculate_salary(employee.id, month, year)
    deductions_text = "; ".join(f"{d['label']}: {result['currency_symbol']}{d['amount']:.2f}" for d in result["deductions"])
    return (
        f"{employee.full_name} — {month}/{year}: present {result['present_days']}/{result['working_days']} days, "
        f"gross {result['currency_symbol']}{result['gross_salary']:.2f}, deductions ({deductions_text}), "
        f"net {result['currency_symbol']}{result['net_salary']:.2f}."
    )


@tool
def generate_payslip(employee_query: str, month: int, year: int) -> str:
    """Compute payroll AND generate/save a PDF payslip for one employee for
    the given month/year. Persists the payroll record."""
    employee, error = _resolve_single(employee_query)
    if error:
        return error
    result = payroll_service.calculate_salary(employee.id, month, year)
    pdf_path = render_payslip_pdf(result)
    crud.upsert_payroll(
        employee_id=employee.id,
        month=month,
        year=year,
        working_days=result["working_days"],
        present_days=result["present_days"],
        absent_days=result["absent_days"],
        gross_salary=result["gross_salary"],
        deductions=result["deductions"],
        net_salary=result["net_salary"],
        payslip_path=pdf_path,
        generated_by="agent",
    )
    return (
        f"Generated payslip for {employee.full_name} ({month}/{year}): "
        f"net {result['currency_symbol']}{result['net_salary']:.2f}. PDF_PATH::{pdf_path}"
    )


@tool
def run_monthly_payroll_all_employees(month: int, year: int) -> str:
    """Run payroll and generate payslips for ALL active employees for a
    given month/year in one go."""
    from agent.graph import run_bulk_payroll  # local import avoids a cycle at module load time

    result = run_bulk_payroll(month, year)
    return result["summary"]


@tool
def get_company_config() -> str:
    """Get company payroll configuration (working days per month, standard
    check-in time, currency, etc.)."""
    config = crud.get_company_config()
    return (
        f"Company: {config.company_name}\nWorking days/month: {config.working_days_per_month}\n"
        f"Standard check-in: {config.standard_check_in_time}\nLate threshold: {config.late_threshold_minutes} min\n"
        f"Currency: {config.currency_symbol}"
    )


ALL_TOOLS = [
    list_employees,
    count_employees,
    get_employee_info,
    register_employee,
    get_attendance_summary,
    get_daily_attendance,
    seed_demo_attendance,
    compute_payroll_preview,
    generate_payslip,
    run_monthly_payroll_all_employees,
    get_company_config,
]
