"""Admin page: create and manage individual guard accounts."""
from __future__ import annotations

import streamlit as st

from db import crud
from utils.auth import require_admin
from utils.theme import apply_theme, page_header, section_title

st.set_page_config(page_title="Guard Management", page_icon="🛡️")
apply_theme()
require_admin()

page_header("🛡️", "Guard Management", "Create and manage guard accounts for attendance capture.")

with st.expander("➕ Add new guard", expanded=True):
    with st.form("new_guard_form", clear_on_submit=True):
        username = st.text_input("Username *", placeholder="guard1")
        full_name = st.text_input("Full name")
        password = st.text_input("Password *", type="password")

        submitted = st.form_submit_button("Create guard", type="primary")
        if submitted:
            if not username or not password:
                st.error("Username and password are required.")
            elif crud.get_guard_by_username(username.strip()):
                st.error(f"Username '{username}' already exists.")
            else:
                crud.create_guard(username=username.strip(), password=password, full_name=full_name or None)
                st.success(f"Created guard account '{username}'.")

section_title("Guards")

guards = crud.list_guards(active_only=True)
if not guards:
    st.info("No guards yet — add one above.")
else:
    for g in guards:
        with st.container(border=True):
            c1, c2, c3 = st.columns([3, 2, 1])
            c1.markdown(f"**{g.full_name or g.username}**  \n`{g.username}`")
            new_password = c2.text_input(
                "Reset password", type="password", key=f"reset_pw_{g.id}",
                placeholder="leave blank to keep current",
            )
            if c2.button("Update password", key=f"update_pw_{g.id}"):
                if new_password:
                    crud.set_guard_password(g.id, new_password)
                    st.success("Password updated.")
                else:
                    st.warning("Enter a new password first.")
            if c3.button("Deactivate", key=f"deactivate_guard_{g.id}"):
                crud.set_guard_active(g.id, False)
                st.rerun()
