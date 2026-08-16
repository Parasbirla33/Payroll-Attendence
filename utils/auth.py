"""Session-state auth gates: a single shared admin password, and individual
guard accounts (username + hashed password) stored in the database."""
from __future__ import annotations

import streamlit as st

from config import settings
from db import crud


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
        if st.button("Log out", key="admin_logout"):
            st.session_state["is_admin"] = False
            st.rerun()


def is_guard() -> bool:
    return bool(st.session_state.get("guard_username"))


def current_guard_name() -> str | None:
    return st.session_state.get("guard_display_name")


def render_guard_login() -> None:
    st.markdown("**🛡️ Guard login**")
    st.caption("Guards use their own account to capture employee attendance.")
    username = st.text_input("Username", key="guard_username_input")
    password = st.text_input("Password", type="password", key="guard_password_input")
    if st.button("Log in", type="primary", key="guard_login_button"):
        guard = crud.verify_guard_login(username.strip(), password)
        if guard is None:
            st.error("Incorrect username or password.")
        else:
            st.session_state["guard_username"] = guard.username
            st.session_state["guard_display_name"] = guard.full_name or guard.username
            st.rerun()


def require_guard() -> None:
    """Call at the top of the guard attendance-capture page. Admins can also
    use this page directly, since admin is a superset of guard access."""
    if is_admin():
        return
    if not is_guard():
        with st.container(border=True):
            render_guard_login()
        st.stop()

    with st.sidebar:
        st.success(f"Guard: {current_guard_name()}")
        if st.button("Log out", key="guard_logout"):
            st.session_state.pop("guard_username", None)
            st.session_state.pop("guard_display_name", None)
            st.rerun()
