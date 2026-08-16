"""Admin page: filterable attendance reports with Excel/CSV export."""
from __future__ import annotations

from datetime import date, timedelta

import pandas as pd
import streamlit as st

from db import crud
from utils.auth import require_admin
from utils.export_utils import to_csv_bytes, to_excel_bytes
from utils.theme import apply_theme, page_header

st.set_page_config(page_title="Attendance Reports", page_icon="📊")
apply_theme()
require_admin()

page_header("📊", "Attendance Reports", "Filter, review, and export attendance history.")

employees = crud.list_employees(active_only=False)
employee_by_id = {e.id: e for e in employees}
options = {f"{e.full_name} ({e.employee_code})": e.id for e in employees}

with st.container(border=True):
    col1, col2, col3 = st.columns(3)
    with col1:
        selected_labels = st.multiselect("Employees (blank = all)", list(options.keys()))
    with col2:
        start_date = st.date_input("Start date", value=date.today() - timedelta(days=30))
    with col3:
        end_date = st.date_input("End date", value=date.today())

employee_ids = [options[label] for label in selected_labels] if selected_labels else None
records = crud.get_attendance_records(
    employee_ids=employee_ids, start_date=start_date, end_date=end_date
)

if not records:
    st.info("No attendance records for the selected filters.")
else:
    rows = []
    for r in records:
        emp = employee_by_id.get(r.employee_id)
        rows.append(
            {
                "Date": r.date,
                "Employee": emp.full_name if emp else r.employee_id,
                "Code": emp.employee_code if emp else "",
                "Check-in": r.check_in.strftime("%H:%M:%S") if r.check_in else "",
                "Check-out": r.check_out.strftime("%H:%M:%S") if r.check_out else "",
                "Status": r.status.value,
                "Work hours": r.work_hours or "",
            }
        )
    df = pd.DataFrame(rows)

    total_days = len(df)
    present_days = len(df[df["Status"].isin(["present", "late"])])
    attendance_pct = round(100 * present_days / total_days, 1) if total_days else 0

    m1, m2, m3 = st.columns(3)
    m1.metric("Records", total_days)
    m2.metric("Present/Late", present_days)
    m3.metric("Attendance %", f"{attendance_pct}%")

    st.dataframe(df, use_container_width=True)

    dl1, dl2 = st.columns(2)
    dl1.download_button(
        "⬇️ Download Excel", to_excel_bytes(df, "Attendance"), "attendance_report.xlsx",
        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        type="primary",
    )
    dl2.download_button("⬇️ Download CSV", to_csv_bytes(df), "attendance_report.csv", mime="text/csv")
