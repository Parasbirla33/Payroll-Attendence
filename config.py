"""Central, typed application settings loaded from .env."""
from __future__ import annotations

import os
import sys
from dataclasses import dataclass

from dotenv import load_dotenv

# Windows' default console codepage (cp1252) can't print emoji that DeepFace's
# logger emits (e.g. when downloading model weights), which crashes the
# download and gets misreported deep in the call stack as unrelated errors.
# Force UTF-8 stdio so any such logging succeeds regardless of launch method.
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

load_dotenv()


def _get(name: str, default: str = "") -> str:
    """Local dev reads .env via os.environ; on Streamlit Community Cloud there
    is no .env file, so fall back to the app's Secrets (st.secrets)."""
    value = os.getenv(name)
    if value:
        return value
    try:
        import streamlit as st

        return str(st.secrets[name])
    except Exception:
        return default


def _get_float(name: str, default: float) -> float:
    value = _get(name)
    return float(value) if value else default


def _get_int(name: str, default: int) -> int:
    value = _get(name)
    return int(value) if value else default


@dataclass(frozen=True)
class Settings:
    anthropic_api_key: str = _get("ANTHROPIC_API_KEY", "")
    anthropic_model: str = _get("ANTHROPIC_MODEL", "claude-opus-5")

    admin_password: str = _get("ADMIN_PASSWORD", "change-me")

    face_match_model: str = _get("FACE_MATCH_MODEL", "Facenet512")
    face_match_threshold: float = _get_float("FACE_MATCH_THRESHOLD", 0.30)

    attendance_dedup_window_minutes: int = _get_int("ATTENDANCE_DEDUP_WINDOW_MINUTES", 5)
    min_minutes_between_checkin_checkout: int = _get_int(
        "MIN_MINUTES_BETWEEN_CHECKIN_CHECKOUT", 60
    )

    database_url: str = _get("DATABASE_URL", "sqlite:///attendance_db.sqlite3")

    base_dir: str = os.path.dirname(os.path.abspath(__file__))

    @property
    def faces_dir(self) -> str:
        return os.path.join(self.base_dir, "data", "faces")

    @property
    def payslips_dir(self) -> str:
        return os.path.join(self.base_dir, "payslips")


settings = Settings()
