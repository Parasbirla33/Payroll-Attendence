"""Conversational tool-calling agent for the AI Agent chat page, built with
LangGraph's prebuilt ReAct agent over the tools in agent/tools.py."""
from __future__ import annotations

from langgraph.prebuilt import create_react_agent

from agent.llm import get_llm
from agent.tools import ALL_TOOLS

SYSTEM_PROMPT = (
    "You are the admin assistant for an attendance and payroll system. "
    "Always use the provided tools to look up real data instead of guessing. "
    "If a tool reports an employee as not found or ambiguous, ask the user to clarify "
    "rather than picking one yourself. Dates are in YYYY-MM-DD format unless noted."
)

_agent = None


def _get_agent():
    global _agent
    if _agent is None:
        _agent = create_react_agent(get_llm(), ALL_TOOLS, prompt=SYSTEM_PROMPT)
    return _agent


def run(user_input: str, history: list[dict]) -> str:
    """history is a list of {"role": "user"|"assistant", "content": str}."""
    agent = _get_agent()
    messages = [(m["role"], m["content"]) for m in history]
    messages.append(("user", user_input))
    result = agent.invoke({"messages": messages})
    return result["messages"][-1].content
