"""LangGraph workflow for running payroll across ALL active employees in one
go. This is the multi-step/looping workflow that a single LLM call can't do
by itself: it fetches every active employee, computes each one's payroll,
renders their payslip PDF, and loops until everyone is processed, then
summarizes. Used identically from the Payroll page's "Run for All Employees"
button and from the run_monthly_payroll_all_employees agent tool."""
from __future__ import annotations

from typing import TypedDict

from langgraph.graph import END, START, StateGraph

from db import crud
from services import payroll as payroll_service
from services.payslip_generator import generate_pdf as render_payslip_pdf


class PayrollState(TypedDict):
    month: int
    year: int
    employee_ids: list[int]
    current_index: int
    current_calc: dict | None
    results: list[dict]
    summary: str


def fetch_employees(state: PayrollState) -> dict:
    employees = crud.list_employees(active_only=True)
    return {"employee_ids": [e.id for e in employees], "current_index": 0, "results": []}


def _route_after_fetch(state: PayrollState) -> str:
    return "compute_payroll" if state["employee_ids"] else "summarize"


def compute_payroll(state: PayrollState) -> dict:
    employee_id = state["employee_ids"][state["current_index"]]
    try:
        calc = payroll_service.calculate_salary(employee_id, state["month"], state["year"])
        return {"current_calc": calc}
    except Exception as exc:  # keep the loop going even if one employee fails
        employee = crud.get_employee(employee_id)
        name = employee.full_name if employee else f"employee #{employee_id}"
        error_result = {
            "employee_id": employee_id,
            "employee_name": name,
            "status": "error",
            "error": str(exc),
        }
        return {"current_calc": None, "results": state["results"] + [error_result]}


def generate_payslip_node(state: PayrollState) -> dict:
    calc = state["current_calc"]
    if calc is None:
        return {}  # compute_payroll already recorded an error result

    employee = calc["employee"]
    pdf_path = render_payslip_pdf(calc)
    crud.upsert_payroll(
        employee_id=employee.id,
        month=calc["month"],
        year=calc["year"],
        working_days=calc["working_days"],
        present_days=calc["present_days"],
        absent_days=calc["absent_days"],
        gross_salary=calc["gross_salary"],
        deductions=calc["deductions"],
        net_salary=calc["net_salary"],
        payslip_path=pdf_path,
        generated_by="agent",
    )
    result = {
        "employee_id": employee.id,
        "employee_name": employee.full_name,
        "status": "ok",
        "net_salary": calc["net_salary"],
        "payslip_path": pdf_path,
    }
    return {"current_calc": None, "results": state["results"] + [result]}


def advance_or_finish(state: PayrollState) -> dict:
    return {"current_index": state["current_index"] + 1}


def _route_after_advance(state: PayrollState) -> str:
    return "compute_payroll" if state["current_index"] < len(state["employee_ids"]) else "summarize"


def summarize(state: PayrollState) -> dict:
    ok = [r for r in state["results"] if r["status"] == "ok"]
    errors = [r for r in state["results"] if r["status"] == "error"]
    total_payout = sum(r["net_salary"] for r in ok)
    lines = [
        f"Processed payroll for {len(ok)} employee(s) for {state['month']}/{state['year']}. "
        f"Total net payout: {total_payout:.2f}."
    ]
    for r in ok:
        lines.append(f"  - {r['employee_name']}: net {r['net_salary']:.2f} ({r['payslip_path']})")
    if errors:
        lines.append(f"{len(errors)} employee(s) failed:")
        for r in errors:
            lines.append(f"  - {r['employee_name']}: {r['error']}")
    return {"summary": "\n".join(lines)}


def _build_graph():
    builder = StateGraph(PayrollState)
    builder.add_node("fetch_employees", fetch_employees)
    builder.add_node("compute_payroll", compute_payroll)
    builder.add_node("generate_payslip", generate_payslip_node)
    builder.add_node("advance_or_finish", advance_or_finish)
    builder.add_node("summarize", summarize)

    builder.add_edge(START, "fetch_employees")
    builder.add_conditional_edges(
        "fetch_employees", _route_after_fetch, {"compute_payroll": "compute_payroll", "summarize": "summarize"}
    )
    builder.add_edge("compute_payroll", "generate_payslip")
    builder.add_edge("generate_payslip", "advance_or_finish")
    builder.add_conditional_edges(
        "advance_or_finish",
        _route_after_advance,
        {"compute_payroll": "compute_payroll", "summarize": "summarize"},
    )
    builder.add_edge("summarize", END)
    return builder.compile()


_payroll_graph = _build_graph()


def run_bulk_payroll(month: int, year: int) -> dict:
    initial_state: PayrollState = {
        "month": month,
        "year": year,
        "employee_ids": [],
        "current_index": 0,
        "current_calc": None,
        "results": [],
        "summary": "",
    }
    return _payroll_graph.invoke(initial_state)
