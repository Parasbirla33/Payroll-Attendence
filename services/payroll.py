"""Pure payroll calculation logic. Deliberately simple/non-statutory; the
deductions list is the extension point for future line items (PF, tax, ...)."""
from __future__ import annotations

from calendar import monthrange
from datetime import date

from db import crud
from db.models import AttendanceStatus


def calculate_salary(employee_id: int, month: int, year: int) -> dict:
    employee = crud.get_employee(employee_id)
    if employee is None:
        raise ValueError(f"No employee with id {employee_id}")

    company = crud.get_company_config()
    working_days = company.working_days_per_month

    start_date = date(year, month, 1)
    end_date = date(year, month, monthrange(year, month)[1])
    records = crud.get_attendance_records(
        employee_ids=[employee_id], start_date=start_date, end_date=end_date
    )
    present_days = sum(
        1 for r in records if r.status in (AttendanceStatus.present, AttendanceStatus.late)
    )
    absent_days = max(working_days - present_days, 0)

    base_salary = float(employee.base_salary)
    per_day_rate = base_salary / working_days if working_days else 0
    deductions = [
        {"label": "Absence deduction", "amount": round(absent_days * per_day_rate, 2)}
    ]
    total_deductions = sum(d["amount"] for d in deductions)
    net_salary = round(base_salary - total_deductions, 2)

    return {
        "employee": employee,
        "month": month,
        "year": year,
        "working_days": working_days,
        "present_days": present_days,
        "absent_days": absent_days,
        "gross_salary": base_salary,
        "deductions": deductions,
        "net_salary": net_salary,
        "currency_symbol": company.currency_symbol,
    }
