"""All database read/write operations. Each function opens and closes its own
short-lived session, which fits Streamlit's rerun-the-whole-script model."""
from __future__ import annotations

import json
from datetime import date, datetime, timedelta

from sqlalchemy import select

from db.database import SessionLocal
from db.models import Attendance, AttendanceStatus, CompanyConfig, Employee, FaceEmbedding, Payroll


# ---------------------------------------------------------------------------
# Employees
# ---------------------------------------------------------------------------

def create_employee(
    *,
    employee_code: str,
    full_name: str,
    email: str | None = None,
    phone: str | None = None,
    designation: str | None = None,
    department: str | None = None,
    date_of_joining: date | None = None,
    base_salary: float = 0,
) -> Employee:
    with SessionLocal() as session:
        employee = Employee(
            employee_code=employee_code,
            full_name=full_name,
            email=email,
            phone=phone,
            designation=designation,
            department=department,
            date_of_joining=date_of_joining,
            base_salary=base_salary,
        )
        session.add(employee)
        session.commit()
        session.refresh(employee)
        return employee


def set_employee_face_dir(employee_id: int, face_dir: str) -> None:
    with SessionLocal() as session:
        employee = session.get(Employee, employee_id)
        if employee:
            employee.face_image_dir = face_dir
            session.commit()


def get_employee(employee_id: int) -> Employee | None:
    with SessionLocal() as session:
        return session.get(Employee, employee_id)


def get_employee_by_code(employee_code: str) -> Employee | None:
    with SessionLocal() as session:
        stmt = select(Employee).where(Employee.employee_code == employee_code)
        return session.execute(stmt).scalar_one_or_none()


def list_employees(active_only: bool = True) -> list[Employee]:
    with SessionLocal() as session:
        stmt = select(Employee)
        if active_only:
            stmt = stmt.where(Employee.active.is_(True))
        stmt = stmt.order_by(Employee.full_name)
        return list(session.execute(stmt).scalars().all())


def count_employees(active_only: bool = True) -> int:
    return len(list_employees(active_only=active_only))


def set_employee_active(employee_id: int, active: bool) -> None:
    with SessionLocal() as session:
        employee = session.get(Employee, employee_id)
        if employee:
            employee.active = active
            session.commit()


def resolve_employees(query: str) -> list[Employee]:
    """Find employees matching a free-text query, by exact code first, then
    case-insensitive name substring. Used to ground agent tool calls."""
    query = query.strip()
    if not query:
        return []
    with SessionLocal() as session:
        exact_code = session.execute(
            select(Employee).where(Employee.employee_code.ilike(query))
        ).scalars().all()
        if exact_code:
            return list(exact_code)
        by_name = session.execute(
            select(Employee).where(Employee.full_name.ilike(f"%{query}%"))
        ).scalars().all()
        return list(by_name)


# ---------------------------------------------------------------------------
# Face embeddings
# ---------------------------------------------------------------------------

def add_face_embedding(
    employee_id: int, embedding: list[float], model_name: str, image_path: str
) -> FaceEmbedding:
    with SessionLocal() as session:
        row = FaceEmbedding(
            employee_id=employee_id,
            embedding=json.dumps(embedding),
            model_name=model_name,
            image_path=image_path,
        )
        session.add(row)
        session.commit()
        session.refresh(row)
        return row


def get_all_face_embeddings(model_name: str) -> list[tuple[int, list[float]]]:
    """Returns (employee_id, embedding_vector) for every stored embedding of the given model."""
    with SessionLocal() as session:
        stmt = select(FaceEmbedding).where(FaceEmbedding.model_name == model_name)
        rows = session.execute(stmt).scalars().all()
        return [(row.employee_id, json.loads(row.embedding)) for row in rows]


# ---------------------------------------------------------------------------
# Attendance
# ---------------------------------------------------------------------------

def get_attendance_for_date(employee_id: int, on_date: date) -> Attendance | None:
    with SessionLocal() as session:
        stmt = select(Attendance).where(
            Attendance.employee_id == employee_id, Attendance.date == on_date
        )
        return session.execute(stmt).scalar_one_or_none()


def create_attendance(
    employee_id: int, on_date: date, check_in: datetime, status: AttendanceStatus
) -> Attendance:
    with SessionLocal() as session:
        row = Attendance(
            employee_id=employee_id, date=on_date, check_in=check_in, status=status
        )
        session.add(row)
        session.commit()
        session.refresh(row)
        return row


def set_check_out(attendance_id: int, check_out: datetime, work_hours: float) -> None:
    with SessionLocal() as session:
        row = session.get(Attendance, attendance_id)
        if row:
            row.check_out = check_out
            row.work_hours = work_hours
            session.commit()


def upsert_attendance(
    *,
    employee_id: int,
    on_date: date,
    check_in: datetime | None,
    check_out: datetime | None,
    status: AttendanceStatus,
) -> Attendance:
    """Admin manual-override: create or replace a day's attendance record."""
    with SessionLocal() as session:
        stmt = select(Attendance).where(
            Attendance.employee_id == employee_id, Attendance.date == on_date
        )
        row = session.execute(stmt).scalar_one_or_none()
        work_hours = None
        if check_in and check_out:
            work_hours = round((check_out - check_in).total_seconds() / 3600, 2)
        if row:
            row.check_in = check_in
            row.check_out = check_out
            row.status = status
            row.work_hours = work_hours
        else:
            row = Attendance(
                employee_id=employee_id,
                date=on_date,
                check_in=check_in,
                check_out=check_out,
                status=status,
                work_hours=work_hours,
            )
            session.add(row)
        session.commit()
        session.refresh(row)
        return row


def get_attendance_records(
    employee_ids: list[int] | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
) -> list[Attendance]:
    with SessionLocal() as session:
        stmt = select(Attendance)
        if employee_ids:
            stmt = stmt.where(Attendance.employee_id.in_(employee_ids))
        if start_date:
            stmt = stmt.where(Attendance.date >= start_date)
        if end_date:
            stmt = stmt.where(Attendance.date <= end_date)
        stmt = stmt.order_by(Attendance.date.desc())
        return list(session.execute(stmt).scalars().all())


def get_attendance_on_date_all(on_date: date) -> list[Attendance]:
    return get_attendance_records(start_date=on_date, end_date=on_date)


def get_today_attendance_summary() -> dict:
    today = date.today()
    records = get_attendance_on_date_all(today)
    present = sum(1 for r in records if r.status in (AttendanceStatus.present, AttendanceStatus.late))
    return {"date": today, "present": present, "marked": len(records)}


# ---------------------------------------------------------------------------
# Payroll
# ---------------------------------------------------------------------------

def upsert_payroll(
    *,
    employee_id: int,
    month: int,
    year: int,
    working_days: int,
    present_days: int,
    absent_days: int,
    gross_salary: float,
    deductions: list[dict],
    net_salary: float,
    payslip_path: str | None,
    generated_by: str = "admin",
) -> Payroll:
    with SessionLocal() as session:
        stmt = select(Payroll).where(
            Payroll.employee_id == employee_id, Payroll.month == month, Payroll.year == year
        )
        row = session.execute(stmt).scalar_one_or_none()
        deductions_json = json.dumps(deductions)
        if row:
            row.working_days = working_days
            row.present_days = present_days
            row.absent_days = absent_days
            row.gross_salary = gross_salary
            row.deductions_json = deductions_json
            row.net_salary = net_salary
            row.payslip_path = payslip_path
            row.generated_at = datetime.utcnow()
            row.generated_by = generated_by
        else:
            row = Payroll(
                employee_id=employee_id,
                month=month,
                year=year,
                working_days=working_days,
                present_days=present_days,
                absent_days=absent_days,
                gross_salary=gross_salary,
                deductions_json=deductions_json,
                net_salary=net_salary,
                payslip_path=payslip_path,
                generated_by=generated_by,
            )
            session.add(row)
        session.commit()
        session.refresh(row)
        return row


def get_payroll_records(
    employee_id: int | None = None, month: int | None = None, year: int | None = None
) -> list[Payroll]:
    with SessionLocal() as session:
        stmt = select(Payroll)
        if employee_id is not None:
            stmt = stmt.where(Payroll.employee_id == employee_id)
        if month is not None:
            stmt = stmt.where(Payroll.month == month)
        if year is not None:
            stmt = stmt.where(Payroll.year == year)
        stmt = stmt.order_by(Payroll.year.desc(), Payroll.month.desc())
        return list(session.execute(stmt).scalars().all())


# ---------------------------------------------------------------------------
# Company config
# ---------------------------------------------------------------------------

def get_company_config() -> CompanyConfig:
    with SessionLocal() as session:
        config = session.get(CompanyConfig, 1)
        if config is None:
            config = CompanyConfig(id=1)
            session.add(config)
            session.commit()
            session.refresh(config)
        return config


def update_company_config(**fields) -> CompanyConfig:
    with SessionLocal() as session:
        config = session.get(CompanyConfig, 1)
        for key, value in fields.items():
            setattr(config, key, value)
        session.commit()
        session.refresh(config)
        return config
