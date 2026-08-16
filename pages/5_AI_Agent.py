"""Admin page: chat with the LangChain/LangGraph tool-calling agent."""
from __future__ import annotations

import os

import streamlit as st

from agent.chat_agent import run as run_agent
from utils.auth import require_admin
from utils.theme import apply_theme, page_header


def _render_payslip_downloads(pdf_paths: list[str], msg_index: int) -> None:
    for i, path in enumerate(pdf_paths):
        if os.path.exists(path):
            with open(path, "rb") as f:
                st.download_button(
                    f"⬇️ Download {os.path.basename(path)}",
                    data=f.read(),
                    file_name=os.path.basename(path),
                    mime="application/pdf",
                    key=f"payslip_dl_{msg_index}_{i}",
                )

st.set_page_config(page_title="AI Agent", page_icon="🤖")
apply_theme()
require_admin()

page_header("🤖", "AI Agent", "Ask about attendance, payroll, or employees — answers are grounded against the real database.")

EXAMPLE_PROMPTS = [
    "Who was absent yesterday?",
    "Summarize John's attendance this month",
    "Generate a payslip for EMP001 for this month",
    "Run monthly payroll for all employees for this month",
]

with st.sidebar:
    st.markdown("**💡 Try asking:**")
    for prompt in EXAMPLE_PROMPTS:
        st.markdown(f"- {prompt}")

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

for i, message in enumerate(st.session_state.chat_history):
    with st.chat_message(message["role"]):
        st.write(message["content"])
        if message.get("pdf_paths"):
            _render_payslip_downloads(message["pdf_paths"], i)

user_input = st.chat_input("Ask the agent...")
if user_input:
    st.session_state.chat_history.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.write(user_input)

    pdf_paths: list[str] = []
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            try:
                reply, pdf_paths = run_agent(user_input, st.session_state.chat_history[:-1])
            except Exception as exc:
                reply = f"Error: {exc}"
        st.write(reply)
        if pdf_paths:
            _render_payslip_downloads(pdf_paths, len(st.session_state.chat_history))

    st.session_state.chat_history.append(
        {"role": "assistant", "content": reply, "pdf_paths": pdf_paths}
    )
