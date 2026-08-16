"""Public page: an employee looks up their own payslips by employee code."""
from __future__ import annotations

import os
from calendar import month_name

import streamlit as st

from db import crud
from utils.theme import apply_theme, page_header

st.set_page_config(page_title="My Payslip", page_icon="🧾")
apply_theme()

page_header("🧾", "My Payslip", "Enter your employee code to view and download your payslips.")

with st.container(border=True):
    employee_code = st.text_input("Employee code", placeholder="EMP001")

if employee_code:
    employee = crud.get_employee_by_code(employee_code.strip())
    if employee is None:
        st.error("No employee found with that code.")
    else:
        st.success(f"Welcome, {employee.full_name}")
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
