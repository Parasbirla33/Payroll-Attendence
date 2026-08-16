"""Admin page: generate individual payslips, run bulk monthly payroll, view history."""
from __future__ import annotations

import os
from calendar import month_name
from datetime import date

import streamlit as st

from db import crud
from services.payroll import calculate_salary
from services.payslip_generator import generate_pdf
from utils.auth import require_admin
from utils.theme import apply_theme, page_header, section_title

st.set_page_config(page_title="Cadence · Payroll", page_icon="💰")
apply_theme()
require_admin()

page_header("💰", "Payroll", "Generate payslips and run monthly payroll.")

employees = crud.list_employees(active_only=True)
employee_by_id = {e.id: e for e in employees}

section_title("Generate a single payslip")
if not employees:
    st.info("No employees enrolled yet.")
else:
    with st.container(border=True):
        options = {f"{e.full_name} ({e.employee_code})": e.id for e in employees}
        col1, col2, col3 = st.columns(3)
        with col1:
            label = st.selectbox("Employee", list(options.keys()))
        with col2:
            month = st.selectbox("Month", list(range(1, 13)), format_func=lambda m: month_name[m], index=date.today().month - 1)
        with col3:
            year = st.number_input("Year", min_value=2000, max_value=2100, value=date.today().year, step=1)

        if st.button("Generate payslip", type="primary"):
            employee_id = options[label]
            result = calculate_salary(employee_id, month, int(year))
            pdf_path = generate_pdf(result)
            crud.upsert_payroll(
                employee_id=employee_id,
                month=month,
                year=int(year),
                working_days=result["working_days"],
                present_days=result["present_days"],
                absent_days=result["absent_days"],
                gross_salary=result["gross_salary"],
                deductions=result["deductions"],
                net_salary=result["net_salary"],
                payslip_path=pdf_path,
                generated_by="admin",
            )
            st.success(
                f"Net salary: {result['currency_symbol']}{result['net_salary']:.2f} "
                f"(present {result['present_days']}/{result['working_days']} days)"
            )
            with open(pdf_path, "rb") as f:
                st.download_button("⬇️ Download payslip PDF", f.read(), os.path.basename(pdf_path), mime="application/pdf")

section_title("Run payroll for all employees")

with st.container(border=True):
    col1, col2 = st.columns(2)
    with col1:
        bulk_month = st.selectbox(
            "Month", list(range(1, 13)), format_func=lambda m: month_name[m], index=date.today().month - 1, key="bulk_month"
        )
    with col2:
        bulk_year = st.number_input("Year", min_value=2000, max_value=2100, value=date.today().year, step=1, key="bulk_year")

    if st.button("Run for all active employees", type="primary"):
        from agent.graph import run_bulk_payroll

        with st.spinner("Running payroll workflow..."):
            result = run_bulk_payroll(bulk_month, int(bulk_year))
        st.text(result["summary"])

section_title("Payroll history")

records = crud.get_payroll_records()
if not records:
    st.info("No payroll runs yet.")
else:
    for r in records:
        emp = employee_by_id.get(r.employee_id) or crud.get_employee(r.employee_id)
        name = emp.full_name if emp else f"employee #{r.employee_id}"
        with st.container(border=True):
            c1, c2, c3 = st.columns([3, 2, 2])
            c1.markdown(f"**{name}**  \n{month_name[r.month]} {r.year}")
            c2.write(f"Net: {r.net_salary}")
            if r.payslip_path and os.path.exists(r.payslip_path):
                with open(r.payslip_path, "rb") as f:
                    c3.download_button(
                        "⬇️ Download", f.read(), os.path.basename(r.payslip_path),
                        mime="application/pdf", key=f"dl_{r.id}",
                    )
