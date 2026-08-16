"""Admin page: chat with the LangChain/LangGraph tool-calling agent."""
from __future__ import annotations

import streamlit as st

from agent.chat_agent import run as run_agent
from utils.auth import require_admin
from utils.theme import apply_theme, page_header

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

for message in st.session_state.chat_history:
    with st.chat_message(message["role"]):
        st.write(message["content"])

user_input = st.chat_input("Ask the agent...")
if user_input:
    st.session_state.chat_history.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.write(user_input)

    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            try:
                reply = run_agent(user_input, st.session_state.chat_history[:-1])
            except Exception as exc:
                reply = f"Error: {exc}"
        st.write(reply)

    st.session_state.chat_history.append({"role": "assistant", "content": reply})
