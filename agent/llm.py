"""OpenAI LLM factory used by the chat agent and LangGraph workflow."""
from __future__ import annotations

from langchain_openai import ChatOpenAI

from config import settings


def get_llm() -> ChatOpenAI:
    return ChatOpenAI(
        model=settings.openai_model,
        api_key=settings.openai_api_key,
        temperature=0,
    )
