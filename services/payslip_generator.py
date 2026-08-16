"""Renders a payroll calculation dict into a PDF payslip via ReportLab."""
from __future__ import annotations

import os
from calendar import month_name

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from config import settings
from db import crud


def generate_pdf(payroll_data: dict) -> str:
    employee = payroll_data["employee"]
    company = crud.get_company_config()

    os.makedirs(settings.payslips_dir, exist_ok=True)
    file_name = f"{employee.employee_code}_{payroll_data['year']}_{payroll_data['month']:02d}.pdf"
    file_path = os.path.join(settings.payslips_dir, file_name)

    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(file_path, pagesize=A4, topMargin=20 * mm, bottomMargin=20 * mm)
    story = []

    story.append(Paragraph(company.company_name, styles["Title"]))
    if company.address:
        story.append(Paragraph(company.address, styles["Normal"]))
    period = f"{month_name[payroll_data['month']]} {payroll_data['year']}"
    story.append(Paragraph(f"Payslip for {period}", styles["Heading2"]))
    story.append(Spacer(1, 8))

    currency = payroll_data["currency_symbol"]

    employee_table = Table(
        [
            ["Employee Name", employee.full_name, "Employee Code", employee.employee_code],
            ["Designation", employee.designation or "-", "Department", employee.department or "-"],
        ],
        colWidths=[35 * mm, 55 * mm, 35 * mm, 55 * mm],
    )
    employee_table.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
            ]
        )
    )
    story.append(employee_table)
    story.append(Spacer(1, 10))

    attendance_table = Table(
        [
            ["Working Days", "Present Days", "Absent Days"],
            [
                str(payroll_data["working_days"]),
                str(payroll_data["present_days"]),
                str(payroll_data["absent_days"]),
            ],
        ],
        colWidths=[60 * mm, 60 * mm, 60 * mm],
    )
    attendance_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.whitesmoke),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
            ]
        )
    )
    story.append(attendance_table)
    story.append(Spacer(1, 14))

    earnings_rows = [["Earnings", "Amount", "Deductions", "Amount"]]
    max_rows = max(1, len(payroll_data["deductions"]))
    for i in range(max_rows):
        earning_label = "Basic Salary" if i == 0 else ""
        earning_amount = f"{currency}{payroll_data['gross_salary']:.2f}" if i == 0 else ""
        if i < len(payroll_data["deductions"]):
            d = payroll_data["deductions"][i]
            ded_label, ded_amount = d["label"], f"{currency}{d['amount']:.2f}"
        else:
            ded_label, ded_amount = "", ""
        earnings_rows.append([earning_label, earning_amount, ded_label, ded_amount])

    total_deductions = sum(d["amount"] for d in payroll_data["deductions"])
    earnings_rows.append(
        ["Gross Total", f"{currency}{payroll_data['gross_salary']:.2f}", "Total Deductions", f"{currency}{total_deductions:.2f}"]
    )

    earnings_table = Table(earnings_rows, colWidths=[45 * mm, 45 * mm, 45 * mm, 45 * mm])
    earnings_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.whitesmoke),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
            ]
        )
    )
    story.append(earnings_table)
    story.append(Spacer(1, 14))

    net_table = Table(
        [["Net Salary Payable", f"{currency}{payroll_data['net_salary']:.2f}"]],
        colWidths=[90 * mm, 90 * mm],
    )
    net_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#e8f5e9")),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 12),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ]
        )
    )
    story.append(net_table)

    doc.build(story)
    return file_path
