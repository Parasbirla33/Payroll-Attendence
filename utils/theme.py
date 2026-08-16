"""Shared visual design system: theme CSS and reusable layout helpers, so
every page looks and feels like one premium product instead of default
Streamlit chrome."""
from __future__ import annotations

import streamlit as st

_CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Lexend:wght@600;700;800&display=swap');

html, body, [class*="css"] {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

:root {
    --brand: #4F46E5;
    --brand-2: #7C3AED;
    --brand-dark: #3730A3;
    --brand-light: #EEF2FF;
    --gold: #C9A24B;
    --gold-light: #FBF3DF;
    --ink: #0F172A;
    --ink-soft: #1E293B;
    --muted: #64748B;
    --muted-light: #94A3B8;
    --border: #E7E9F1;
    --surface: #FFFFFF;
    --bg: #F7F7FB;
    --success: #059669;
    --success-bg: #ECFDF5;
    --danger: #DC2626;
    --danger-bg: #FEF2F2;
    --warning: #B45309;
    --warning-bg: #FFFBEB;
    --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
    --shadow-md: 0 6px 20px -4px rgba(30, 27, 75, 0.10), 0 2px 6px rgba(15, 23, 42, 0.05);
    --shadow-lift: 0 12px 28px -8px rgba(30, 27, 75, 0.18), 0 4px 10px rgba(15, 23, 42, 0.06);
}

/* App backdrop: soft brand-tinted gradient wash instead of flat white */
[data-testid="stAppViewContainer"] {
    background:
        radial-gradient(1100px 480px at 12% -8%, rgba(124, 58, 237, 0.07), transparent 60%),
        radial-gradient(900px 420px at 100% 0%, rgba(79, 70, 229, 0.06), transparent 55%),
        var(--bg);
}

/* Thin gradient accent strip pinned to the very top of the viewport */
[data-testid="stAppViewContainer"]::before {
    content: "";
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--brand) 0%, var(--brand-2) 55%, var(--gold) 100%);
    z-index: 1000;
}

.block-container {
    padding-top: 2.5rem;
    padding-bottom: 3rem;
    max-width: 880px;
}

h1, h2, h3 { font-family: 'Lexend', 'Inter', sans-serif; letter-spacing: -0.01em; }

/* ---------------- Sidebar: dark premium nav rail ---------------- */
section[data-testid="stSidebar"] {
    background: linear-gradient(195deg, #0F172A 0%, #191340 65%, #241B54 100%);
    border-right: 1px solid rgba(255, 255, 255, 0.06);
}
section[data-testid="stSidebar"] * { color: #E2E4F3 !important; }
section[data-testid="stSidebar"] [data-testid="stSidebarNav"] a,
section[data-testid="stSidebar"] .stPageLink a {
    border-radius: 9px;
    margin: 1px 0;
    transition: background 0.15s ease, transform 0.15s ease;
}
section[data-testid="stSidebar"] [data-testid="stSidebarNav"] a:hover,
section[data-testid="stSidebar"] .stPageLink a:hover {
    background: rgba(255, 255, 255, 0.08) !important;
}
section[data-testid="stSidebar"] [data-testid="stSidebarNav"] a[aria-current="page"] {
    background: linear-gradient(90deg, rgba(124, 58, 237, 0.35), rgba(124, 58, 237, 0.08)) !important;
    box-shadow: inset 2px 0 0 var(--gold);
}
section[data-testid="stSidebar"] hr { border-color: rgba(255, 255, 255, 0.10); }
section[data-testid="stSidebar"] input,
section[data-testid="stSidebar"] [data-baseweb="select"] > div {
    background: rgba(255, 255, 255, 0.06) !important;
    border-color: rgba(255, 255, 255, 0.14) !important;
}
section[data-testid="stSidebar"] .stButton > button {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: #F1F2FA !important;
}
section[data-testid="stSidebar"] .stButton > button:hover {
    background: rgba(255, 255, 255, 0.16);
}
section[data-testid="stSidebar"] div[data-testid="stAlert"] * { color: inherit !important; }

/* ---------------- Buttons ---------------- */
.stButton > button, .stDownloadButton > button, .stFormSubmitButton > button {
    border-radius: 10px;
    font-weight: 600;
    padding: 0.5rem 1.25rem;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}
.stButton > button[kind="primary"], .stFormSubmitButton > button[kind="primary"] {
    background: linear-gradient(135deg, var(--brand) 0%, var(--brand-2) 100%);
    border: none;
    box-shadow: 0 4px 14px -2px rgba(79, 70, 229, 0.45);
}
.stButton > button[kind="primary"]:hover, .stFormSubmitButton > button[kind="primary"]:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px -4px rgba(79, 70, 229, 0.55);
}
.stDownloadButton > button {
    border: 1px solid var(--border);
    background: var(--surface);
}
.stDownloadButton > button:hover {
    border-color: var(--brand);
    color: var(--brand-dark);
    transform: translateY(-1px);
}

/* ---------------- Metrics as premium cards ---------------- */
div[data-testid="stMetric"] {
    background: linear-gradient(165deg, var(--surface) 0%, #FBFBFE 100%);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.1rem 1.3rem;
    box-shadow: var(--shadow-md);
    position: relative;
    overflow: hidden;
}
div[data-testid="stMetric"]::before {
    content: "";
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, var(--brand), var(--brand-2));
}
div[data-testid="stMetricLabel"] { color: var(--muted); font-weight: 600; }
div[data-testid="stMetricValue"] { font-family: 'Lexend', sans-serif; color: var(--ink); }

/* ---------------- Bordered containers used as cards ---------------- */
div[data-testid="stVerticalBlockBorderWrapper"] {
    border-radius: 16px !important;
    border-color: var(--border) !important;
    background: var(--surface);
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s ease;
}

/* ---------------- Inputs ---------------- */
.stTextInput input, .stNumberInput input, .stDateInput input, .stTimeInput input,
[data-baseweb="select"] > div, .stTextArea textarea {
    border-radius: 10px !important;
    border-color: var(--border) !important;
}
.stTextInput input:focus, .stNumberInput input:focus {
    border-color: var(--brand) !important;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12) !important;
}

/* Tabs */
.stTabs [data-baseweb="tab-list"] { gap: 4px; border-bottom: 1px solid var(--border); }
.stTabs [data-baseweb="tab"] { font-weight: 600; color: var(--muted); }
.stTabs [aria-selected="true"] { color: var(--brand-dark) !important; }
.stTabs [data-baseweb="tab-highlight"] {
    background: linear-gradient(90deg, var(--brand), var(--brand-2)) !important;
    height: 3px !important;
}

/* Alerts: slightly softer corners to match the rest of the UI */
div[data-testid="stAlert"] {
    border-radius: 12px;
    border: 1px solid transparent;
}

/* Dataframes / tables */
[data-testid="stDataFrame"] {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
}

/* Chat bubbles on the AI Agent page */
[data-testid="stChatMessage"] {
    border-radius: 14px;
    box-shadow: var(--shadow-sm);
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


BRAND_NAME = "Cadence"
BRAND_TAGLINE = "Attendance & Payroll, refined"

# Abstract "cadence bars" mark: three rounded bars of different heights on a
# gradient badge — evokes both a rhythm/pulse (cadence) and an attendance
# chart. Pure SVG so it renders crisply at any size with no image assets.
_LOGO_SVG = """
<svg width="{size}" height="{size}" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="8" fill="url(#cadence-grad)"/>
    <rect x="6.4" y="15" width="3.2" height="6.5" rx="1.6" fill="white" fill-opacity="0.95"/>
    <rect x="12.4" y="7" width="3.2" height="14.5" rx="1.6" fill="white"/>
    <rect x="18.4" y="11.5" width="3.2" height="10" rx="1.6" fill="white" fill-opacity="0.95"/>
    <defs>
        <linearGradient id="cadence-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stop-color="#4F46E5"/>
            <stop offset="1" stop-color="#7C3AED"/>
        </linearGradient>
    </defs>
</svg>
"""


def logo_svg(size: int = 28) -> str:
    """Standalone SVG markup for the Cadence mark, e.g. to drop into a page_header icon slot."""
    return _LOGO_SVG.format(size=size)


def brand_lockup() -> str:
    """Logo mark + wordmark + tagline, as used at the top of the sidebar."""
    return f"""
    <div style="display:flex;align-items:center;gap:0.6rem;padding:0.9rem 0.9rem 1rem;
        margin:-1rem -1rem 0.5rem;border-bottom:1px solid rgba(255,255,255,0.10);">
        {logo_svg(30)}
        <div style="line-height:1.2;">
            <div style="font-family:'Lexend',sans-serif;font-weight:800;font-size:1.15rem;
                color:#F5F5FF;letter-spacing:-0.01em;">{BRAND_NAME}</div>
            <div style="font-size:0.68rem;color:#A5A9D9;font-weight:500;">{BRAND_TAGLINE}</div>
        </div>
    </div>
    """


def apply_theme() -> None:
    """Call once near the top of every page, right after st.set_page_config().
    Also injects the brand lockup at the top of the sidebar on every page."""
    st.markdown(_CSS, unsafe_allow_html=True)
    with st.sidebar:
        st.markdown(brand_lockup(), unsafe_allow_html=True)


def page_header(icon: str, title: str, subtitle: str = "") -> None:
    """Consistent large page title + optional subtitle, replacing st.title().
    Icon sits in a soft gradient badge, with a thin gradient rule underneath."""
    subtitle_html = (
        f'<div style="color:var(--muted);font-size:1.02rem;margin-top:0.3rem;">{subtitle}</div>'
        if subtitle
        else ""
    )
    st.markdown(
        f"""
        <div style="margin-bottom:1.75rem;">
            <div style="display:flex;align-items:center;gap:0.75rem;">
                <div style="
                    width:2.75rem;height:2.75rem;border-radius:12px;flex-shrink:0;
                    display:flex;align-items:center;justify-content:center;font-size:1.4rem;
                    background:linear-gradient(135deg, var(--brand-light), #F3EEFF);
                    box-shadow: inset 0 0 0 1px rgba(79,70,229,0.12);
                ">{icon}</div>
                <div style="font-family:'Lexend',sans-serif;font-size:1.95rem;font-weight:800;
                    color:var(--ink);line-height:1.15;">
                    {title}
                </div>
            </div>
            {subtitle_html}
            <div style="height:3px;width:56px;margin-top:1rem;border-radius:999px;
                background:linear-gradient(90deg, var(--brand), var(--brand-2));"></div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def section_title(text: str) -> None:
    """Smaller heading used to divide a page into sections, replacing st.subheader()."""
    st.markdown(
        f'<div style="font-family:\'Lexend\',sans-serif;font-size:1.1rem;font-weight:700;'
        f'color:var(--ink);margin:1.4rem 0 0.6rem;">{text}</div>',
        unsafe_allow_html=True,
    )


def badge(text: str, kind: str = "brand") -> str:
    """Small pill-shaped label, e.g. for attendance status. Returns HTML string."""
    colors = {
        "brand": ("linear-gradient(135deg, var(--brand-light), #F3EEFF)", "var(--brand-dark)"),
        "success": ("var(--success-bg)", "var(--success)"),
        "danger": ("var(--danger-bg)", "var(--danger)"),
        "warning": ("var(--warning-bg)", "var(--warning)"),
        "gold": ("var(--gold-light)", "#8A6D1F"),
        "muted": ("#F1F5F9", "var(--muted)"),
    }
    bg, fg = colors.get(kind, colors["brand"])
    return (
        f'<span style="background:{bg};color:{fg};padding:0.2rem 0.7rem;'
        f'border-radius:999px;font-size:0.78rem;font-weight:700;letter-spacing:0.01em;">{text}</span>'
    )
