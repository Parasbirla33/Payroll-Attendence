"""Public page: an employee looks up their own attendance history and
payslips by employee code (no password — identity is just the code)."""
from __future__ import annotations

import os
from calendar import month_name
from datetime import date, timedelta

import streamlit as st

from db import crud
from utils.theme import apply_theme, page_header, section_title

st.set_page_config(page_title="Employee Portal", page_icon="🧑‍💼")
apply_theme()

page_header("🧑‍💼", "Employee Portal", "Enter your employee code to view your attendance and payslips.")

with st.container(border=True):
    employee_code = st.text_input("Employee code", placeholder="EMP001")

if employee_code:
    employee = crud.get_employee_by_code(employee_code.strip())
    if employee is None:
        st.error("No employee found with that code.")
    else:
        st.success(f"Welcome, {employee.full_name}")
        tab_attendance, tab_payslips = st.tabs(["📅 Attendance History", "🧾 Payslips"])

        with tab_attendance:
            col1, col2 = st.columns(2)
            with col1:
                start_date = st.date_input("Start date", value=date.today() - timedelta(days=30))
            with col2:
                end_date = st.date_input("End date", value=date.today())

            records = crud.get_attendance_records(
                employee_ids=[employee.id], start_date=start_date, end_date=end_date
            )
            if not records:
                st.info("No attendance records for the selected dates.")
            else:
                for r in records:
                    with st.container(border=True):
                        c1, c2, c3 = st.columns(3)
                        c1.markdown(f"**{r.date}**")
                        c2.write(f"In: {r.check_in.strftime('%H:%M:%S') if r.check_in else '—'}")
                        c3.write(f"Out: {r.check_out.strftime('%H:%M:%S') if r.check_out else '—'}")
                        st.caption(f"Status: {r.status.value}" + (f" · {r.work_hours}h worked" if r.work_hours else ""))

        with tab_payslips:
            records = crud.get_payroll_records(employee_id=employee.id)
            if not records:
                st.info("No payslips generated yet.")
            else:
                for r in records:
                    with st.container(border=True):
                        c1, c2 = st.columns([3, 1])
                        c1.markdown(f"**{month_name[r.month]} {r.year}**  \nNet: {r.net_salary}")
                        if r.payslip_path and os.path.exists(r.payslip_path):
                            with open(r.payslip_path, "rb") as f:
                                c2.download_button(
                                    "⬇️ Download", f.read(), os.path.basename(r.payslip_path),
                                    mime="application/pdf", key=f"my_dl_{r.id}",
                                )
