"""Anthropic Claude LLM factory used by the chat agent and LangGraph workflow."""
from __future__ import annotations

from langchain_anthropic import ChatAnthropic

from config import settings


def get_llm() -> ChatAnthropic:
    return ChatAnthropic(
        model=settings.anthropic_model,
        api_key=settings.anthropic_api_key,
        temperature=0,
    )
