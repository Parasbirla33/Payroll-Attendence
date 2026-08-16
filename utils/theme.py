"""Shared visual design system: theme CSS and reusable layout helpers, so
every page looks and feels like one product instead of default Streamlit."""
from __future__ import annotations

import streamlit as st

_CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

html, body, [class*="css"] {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

:root {
    --brand: #4F46E5;
    --brand-dark: #4338CA;
    --brand-light: #EEF2FF;
    --ink: #0F172A;
    --muted: #64748B;
    --border: #E2E8F0;
    --success: #059669;
    --success-bg: #ECFDF5;
    --danger: #DC2626;
    --danger-bg: #FEF2F2;
}

.block-container {
    padding-top: 2.25rem;
    padding-bottom: 3rem;
    max-width: 880px;
}

/* Buttons */
.stButton > button, .stDownloadButton > button, .stFormSubmitButton > button {
    border-radius: 10px;
    font-weight: 600;
    padding: 0.5rem 1.25rem;
    transition: all 0.15s ease;
}
.stButton > button[kind="primary"], .stFormSubmitButton > button[kind="primary"] {
    background: var(--brand);
    border-color: var(--brand);
    box-shadow: 0 1px 2px rgba(79, 70, 229, 0.25);
}
.stButton > button[kind="primary"]:hover {
    background: var(--brand-dark);
    border-color: var(--brand-dark);
}

/* Metrics as cards */
div[data-testid="stMetric"] {
    background: #FFFFFF;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1rem 1.25rem;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}
div[data-testid="stMetricLabel"] { color: var(--muted); }

/* Bordered containers used as cards */
div[data-testid="stVerticalBlockBorderWrapper"] {
    border-radius: 14px !important;
    border-color: var(--border) !important;
}

/* Sidebar */
section[data-testid="stSidebar"] {
    border-right: 1px solid var(--border);
}
section[data-testid="stSidebar"] .stPageLink {
    border-radius: 8px;
}

/* Alerts: slightly softer corners to match the rest of the UI */
div[data-testid="stAlert"] {
    border-radius: 10px;
}

/* Hide default Streamlit chrome for a cleaner product feel */
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}

/* Mobile: full-width tappable buttons, tighter side padding */
@media (max-width: 640px) {
    .block-container { padding-left: 1rem; padding-right: 1rem; }
    .stButton > button, .stDownloadButton > button, .stFormSubmitButton > button {
        width: 100%;
    }
    div[data-testid="stMetric"] { padding: 0.85rem 1rem; }
}
</style>
"""


def apply_theme() -> None:
    """Call once near the top of every page, right after st.set_page_config()."""
    st.markdown(_CSS, unsafe_allow_html=True)


def page_header(icon: str, title: str, subtitle: str = "") -> None:
    """Consistent large page title + optional subtitle, replacing st.title()."""
    subtitle_html = (
        f'<div style="color:var(--muted);font-size:1rem;margin-top:0.15rem;">{subtitle}</div>'
        if subtitle
        else ""
    )
    st.markdown(
        f"""
        <div style="margin-bottom:1.5rem;">
            <div style="font-size:1.9rem;font-weight:800;color:var(--ink);line-height:1.2;">
                {icon}&nbsp; {title}
            </div>
            {subtitle_html}
        </div>
        """,
        unsafe_allow_html=True,
    )


def section_title(text: str) -> None:
    """Smaller heading used to divide a page into sections, replacing st.subheader()."""
    st.markdown(
        f'<div style="font-size:1.15rem;font-weight:700;color:var(--ink);'
        f'margin:1.25rem 0 0.5rem;">{text}</div>',
        unsafe_allow_html=True,
    )


def badge(text: str, kind: str = "brand") -> str:
    """Small pill-shaped label, e.g. for attendance status. Returns HTML string."""
    colors = {
        "brand": ("var(--brand-light)", "var(--brand-dark)"),
        "success": ("var(--success-bg)", "var(--success)"),
        "danger": ("var(--danger-bg)", "var(--danger)"),
        "muted": ("#F1F5F9", "var(--muted)"),
    }
    bg, fg = colors.get(kind, colors["brand"])
    return (
        f'<span style="background:{bg};color:{fg};padding:0.15rem 0.6rem;'
        f'border-radius:999px;font-size:0.8rem;font-weight:600;">{text}</span>'
    )
