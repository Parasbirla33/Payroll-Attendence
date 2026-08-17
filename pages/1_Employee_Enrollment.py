"""Admin page: create employee profiles and capture face enrollment photos."""
from __future__ import annotations

import os
from datetime import date

import streamlit as st

from config import settings
from db import crud
from services.face_recognition import enroll_face, photo_matches_employee
from utils.auth import require_admin
from utils.theme import apply_theme, page_header, section_title

st.set_page_config(page_title="Cadence · Employee Enrollment", page_icon="👤")
apply_theme()
require_admin()

page_header("👤", "Employee Enrollment", "Add employees and capture their face photos.")

with st.expander("➕ Add new employee", expanded=True):
    with st.form("new_employee_form", clear_on_submit=True):
        col1, col2 = st.columns(2)
        with col1:
            employee_code = st.text_input("Employee code *", placeholder="EMP001")
            full_name = st.text_input("Full name *")
            email = st.text_input("Email")
            phone = st.text_input("Phone")
        with col2:
            designation = st.text_input("Designation")
            department = st.text_input("Department")
            joining_date = st.date_input("Date of joining", value=date.today())
            base_salary = st.number_input("Base salary (monthly)", min_value=0.0, step=1000.0)

        submitted = st.form_submit_button("Create employee", type="primary")
        if submitted:
            if not employee_code or not full_name:
                st.error("Employee code and full name are required.")
            elif crud.get_employee_by_code(employee_code):
                st.error(f"Employee code '{employee_code}' already exists.")
            else:
                crud.create_employee(
                    employee_code=employee_code,
                    full_name=full_name,
                    email=email or None,
                    phone=phone or None,
                    designation=designation or None,
                    department=department or None,
                    date_of_joining=joining_date,
                    base_salary=base_salary,
                )
                st.success(f"Created {full_name} ({employee_code}). Now capture face photos below.")

section_title("📸 Capture face photos")

employees = crud.list_employees(active_only=True)
if not employees:
    st.info("No employees yet — add one above first.")
else:
    with st.container(border=True):
        options = {f"{e.full_name} ({e.employee_code})": e.id for e in employees}
        selected_label = st.selectbox("Select employee", list(options.keys()))
        employee_id = options[selected_label]

        face_dir = os.path.join(settings.faces_dir, f"employee_{employee_id}")
        existing_count = len(os.listdir(face_dir)) if os.path.isdir(face_dir) else 0
        max_photos = 2
        st.caption(f"📷 {existing_count}/{max_photos} photo(s) enrolled.")

        if "enroll_cam_key" not in st.session_state:
            st.session_state.enroll_cam_key = 0

        if existing_count >= max_photos:
            st.success("Enrollment complete — 2 matching photos on file.")
        else:
            photo = st.camera_input(
                "Take a photo" if existing_count == 0 else "Take a second photo of the SAME person",
                key=f"enroll_cam_{st.session_state.enroll_cam_key}",
            )

            if photo is not None and st.button("Save this photo", type="primary"):
                rejected = False
                if existing_count > 0:
                    matched, distance, message = photo_matches_employee(employee_id, photo.getvalue())
                    if not matched:
                        st.error(message)
                        rejected = True

                if not rejected:
                    ok, message = enroll_face(employee_id, photo.getvalue(), existing_count + 1)
                    if ok:
                        st.success(message)
                    else:
                        st.error(message)
                        rejected = True

                st.session_state.enroll_cam_key += 1
                if not rejected:
                    st.rerun()

section_title("Employees")

for e in crud.list_employees(active_only=True):
    with st.container(border=True):
        c1, c2, c3 = st.columns([3, 2, 1])
        c1.markdown(f"**{e.full_name}**  \n`{e.employee_code}`")
        c2.write(e.department or "—")
        if c3.button("Deactivate", key=f"deactivate_{e.id}"):
            crud.set_employee_active(e.id, False)
            st.rerun()
