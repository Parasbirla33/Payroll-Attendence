"""Entry point: page config, DB init, landing page with public employee links
and an admin-gated dashboard summary."""
from __future__ import annotations

import streamlit as st

from db.database import init_db
from db import crud
from utils.auth import is_admin, render_admin_login
from utils.theme import apply_theme, page_header, section_title

st.set_page_config(page_title="Attendance & Payroll", page_icon="🧾", layout="centered")
apply_theme()
init_db()

page_header("🧾", "Attendance & Payroll", "AI-powered attendance tracking and payroll, in one place.")

section_title("Employee self-service")
col1, col2 = st.columns(2)
with col1:
    with st.container(border=True):
        st.markdown("**📸 Mark Attendance**")
        st.caption("Check in or out with a selfie — no login needed.")
        st.page_link("pages/2_Attendance_Checkin.py", label="Open", icon="➡️")
with col2:
    with st.container(border=True):
        st.markdown("**🧾 My Payslip**")
        st.caption("Look up your payslips by employee code.")
        st.page_link("pages/6_My_Payslip.py", label="Open", icon="➡️")

st.divider()
section_title("Admin")

if not is_admin():
    with st.container(border=True):
        render_admin_login()
else:
    with st.sidebar:
        st.success("Logged in as admin")

    total_active = crud.count_employees(active_only=True)
    today_summary = crud.get_today_attendance_summary()

    m1, m2, m3 = st.columns(3)
    m1.metric("Active employees", total_active)
    m2.metric("Present today", today_summary["present"])
    m3.metric("Marked today", today_summary["marked"])

    section_title("Admin pages")
    admin_pages = [
        ("👤", "Employee Enrollment", "Add employees and capture face photos.", "pages/1_Employee_Enrollment.py"),
        ("📊", "Attendance Reports", "Filter, review, and export attendance.", "pages/3_Attendance_Reports.py"),
        ("💰", "Payroll", "Generate payslips, single or in bulk.", "pages/4_Payroll.py"),
        ("🤖", "AI Agent", "Ask questions about attendance and payroll.", "pages/5_AI_Agent.py"),
    ]
    cols = st.columns(2)
    for i, (icon, title, desc, path) in enumerate(admin_pages):
        with cols[i % 2]:
            with st.container(border=True):
                st.markdown(f"**{icon} {title}**")
                st.caption(desc)
                st.page_link(path, label="Open", icon="➡️")
