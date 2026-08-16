"""Simple session-state password gate for admin-only pages."""
from __future__ import annotations

import streamlit as st

from config import settings


def is_admin() -> bool:
    return bool(st.session_state.get("is_admin", False))


def render_admin_login() -> None:
    st.markdown("**🔒 Admin login**")
    st.caption("Enter the admin password to manage employees, payroll, and reports.")
    password = st.text_input("Admin password", type="password", key="admin_password_input")
    if st.button("Log in", type="primary"):
        if password == settings.admin_password:
            st.session_state["is_admin"] = True
            st.rerun()
        else:
            st.error("Incorrect password.")


def require_admin() -> None:
    """Call at the top of any admin-only page. Renders a login form and
    st.stop()s the page if the admin isn't authenticated yet."""
    if not is_admin():
        with st.container(border=True):
            render_admin_login()
        st.stop()

    with st.sidebar:
        if st.button("Log out"):
            st.session_state["is_admin"] = False
            st.rerun()
