"""Attendance business logic: check-in/check-out state machine with dedup."""
from __future__ import annotations

from datetime import datetime, timedelta

from config import settings
from db import crud
from db.models import Attendance, AttendanceStatus


def _determine_status(check_in: datetime) -> AttendanceStatus:
    company = crud.get_company_config()
    scheduled = datetime.combine(check_in.date(), company.standard_check_in_time)
    grace_deadline = scheduled + timedelta(minutes=company.late_threshold_minutes)
    return AttendanceStatus.present if check_in <= grace_deadline else AttendanceStatus.late


def mark_attendance(employee_id: int) -> tuple[str, Attendance | None]:
    """Returns (outcome, attendance_row). outcome is one of:
    'check_in', 'check_out', 'duplicate', 'already_complete'."""
    now = datetime.now()
    today = now.date()
    existing = crud.get_attendance_for_date(employee_id, today)

    if existing is None:
        status = _determine_status(now)
        row = crud.create_attendance(employee_id, today, now, status)
        return "check_in", row

    if existing.check_out is not None:
        elapsed_minutes = (now - existing.check_out).total_seconds() / 60
        if elapsed_minutes < settings.attendance_dedup_window_minutes:
            return "duplicate", existing
        return "already_complete", existing

    elapsed_since_checkin = (now - existing.check_in).total_seconds() / 60
    if elapsed_since_checkin < settings.attendance_dedup_window_minutes:
        return "duplicate", existing
    if elapsed_since_checkin < settings.min_minutes_between_checkin_checkout:
        return "duplicate", existing

    work_hours = round(elapsed_since_checkin / 60, 2)
    crud.set_check_out(existing.id, now, work_hours)
    updated = crud.get_attendance_for_date(employee_id, today)
    return "check_out", updated
