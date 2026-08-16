"""Conversational tool-calling agent for the AI Agent chat page, built with
LangGraph's prebuilt ReAct agent over the tools in agent/tools.py."""
from __future__ import annotations

import re
from datetime import date

from langgraph.prebuilt import create_react_agent

from agent.llm import get_llm
from agent.tools import ALL_TOOLS

SYSTEM_PROMPT = (
    "You are the admin assistant for an attendance and payroll system. "
    "Always use the provided tools to look up real data instead of guessing. "
    "If a tool reports an employee as not found or ambiguous, ask the user to clarify "
    "rather than picking one yourself. Dates are in YYYY-MM-DD format unless noted. "
    "When a tool generates a payslip PDF, NEVER include the file path, a file:// URL, "
    "or any invented download link in your reply — the app attaches a real download "
    "button below your message automatically. Just confirm what was generated (employee, "
    "month, net salary)."
)

_agent = None


def _get_agent():
    global _agent
    if _agent is None:
        _agent = create_react_agent(get_llm(), ALL_TOOLS, prompt=SYSTEM_PROMPT)
    return _agent


def run(user_input: str, history: list[dict]) -> tuple[str, list[str]]:
    """history is a list of {"role": "user"|"assistant", "content": str}.
    Returns (reply_text, pdf_paths) — pdf_paths lists any payslip PDFs the
    agent generated this turn (via the generate_payslip tool), extracted
    directly from the tool's own output rather than the model's paraphrase,
    so the UI can attach real download buttons instead of relying on the
    model to produce a working link (it can't — local paths aren't URLs)."""
    agent = _get_agent()
    # Computed fresh per call (not baked into the static system prompt) so a
    # long-running server process doesn't answer "yesterday" with a stale date.
    today_note = (
        "system",
        f"Today's date is {date.today().isoformat()} (YYYY-MM-DD). "
        "Resolve any relative date reference (yesterday, this month, last month, etc.) against this.",
    )
    messages = [today_note] + [(m["role"], m["content"]) for m in history]
    messages.append(("user", user_input))
    result = agent.invoke({"messages": messages})

    pdf_paths = []
    for msg in result["messages"]:
        if getattr(msg, "name", None) == "generate_payslip" and isinstance(msg.content, str):
            match = re.search(r"PDF_PATH::(.+\.pdf)", msg.content)
            if match:
                pdf_paths.append(match.group(1))

    return result["messages"][-1].content, pdf_paths
