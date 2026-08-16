"""Guard-only page: capture each employee's selfie to mark attendance via
face recognition. Requires an individual guard account (or admin) to log in."""
from __future__ import annotations

from datetime import date, datetime, time

import streamlit as st

from db import crud
from db.models import AttendanceStatus
from services.attendance import mark_attendance
from services.face_recognition import recognize_face
from utils.auth import is_admin, require_guard
from utils.theme import apply_theme, page_header

st.set_page_config(page_title="Guard Attendance", page_icon="🛡️")
apply_theme()
require_guard()

page_header("🛡️", "Guard Attendance", "Capture each employee's photo to mark their check-in/out.")

with st.container(border=True):
    photo = st.camera_input("Take a photo")

    if photo is not None and st.button("Submit", type="primary"):
        employee, distance, message = recognize_face(photo.getvalue())
        if employee is None:
            st.error(message)
        else:
            outcome, row = mark_attendance(employee.id)
            if outcome == "check_in":
                st.success(f"Checked in: {employee.full_name} at {row.check_in.strftime('%H:%M:%S')} ({row.status.value})")
            elif outcome == "check_out":
                st.success(f"Checked out: {employee.full_name} at {row.check_out.strftime('%H:%M:%S')} — worked {row.work_hours} hours")
            elif outcome == "duplicate":
                st.warning("Already marked recently — ignoring duplicate capture.")
            else:
                st.info(f"Attendance already completed for {employee.full_name} today.")

if is_admin():
    st.divider()
    with st.expander("Admin: manual attendance override"):
        employees = crud.list_employees(active_only=True)
        if not employees:
            st.info("No employees enrolled yet.")
        else:
            options = {f"{e.full_name} ({e.employee_code})": e.id for e in employees}
            label = st.selectbox("Employee", list(options.keys()), key="override_employee")
            override_date = st.date_input("Date", value=date.today(), key="override_date")
            status = st.selectbox(
                "Status", [s.value for s in AttendanceStatus], key="override_status"
            )
            has_checkin = st.checkbox("Set check-in time", value=True, key="override_has_checkin")
            checkin_time = st.time_input("Check-in time", value=time(9, 30), key="override_checkin_time") if has_checkin else None
            has_checkout = st.checkbox("Set check-out time", value=False, key="override_has_checkout")
            checkout_time = st.time_input("Check-out time", value=time(18, 30), key="override_checkout_time") if has_checkout else None

            if st.button("Save override", type="primary"):
                employee_id = options[label]
                check_in_dt = datetime.combine(override_date, checkin_time) if checkin_time else None
                check_out_dt = datetime.combine(override_date, checkout_time) if checkout_time else None
                crud.upsert_attendance(
                    employee_id=employee_id,
                    on_date=override_date,
                    check_in=check_in_dt,
                    check_out=check_out_dt,
                    status=AttendanceStatus(status),
                )
                st.success("Attendance record saved.")
                st.rerun()
