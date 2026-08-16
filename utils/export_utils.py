"""DataFrame export helpers for Streamlit download buttons."""
from __future__ import annotations

import io

import pandas as pd


def to_excel_bytes(df: pd.DataFrame, sheet_name: str = "Sheet1") -> bytes:
    buffer = io.BytesIO()
    with pd.ExcelWriter(buffer, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name=sheet_name)
    return buffer.getvalue()


def to_csv_bytes(df: pd.DataFrame) -> bytes:
    return df.to_csv(index=False).encode("utf-8")
