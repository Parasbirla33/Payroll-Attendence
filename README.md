# AI Attendance & Payroll Management

A Streamlit app for employee profile management, selfie-based face-recognition
attendance, attendance reporting, automated payroll, and a LangChain/LangGraph
AI agent for natural-language queries over the same data.

## Stack

- **UI**: Streamlit (multi-page app)
- **Face recognition**: DeepFace + OpenCV
- **Database**: SQLite via SQLAlchemy
- **AI agent**: LangChain (tool-calling) + LangGraph (bulk payroll workflow) + OpenAI (gpt-4o-mini)
- **Payslips**: ReportLab-generated PDFs

## Setup

1. Create and activate a virtual environment (Python 3.11 or 3.12 recommended):
   ```
   python -m venv venv
   venv\Scripts\activate
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and fill in:
   - `OPENAI_API_KEY` — required for the AI Agent page
   - `ADMIN_PASSWORD` — password for admin-only pages
   - Other values have sensible defaults
4. Run the app:
   ```
   streamlit run app.py
   ```

## Windows / DeepFace notes

- TensorFlow is a large (~500MB+) CPU-only install on Windows; the first
  `pip install` will take a while.
- The first face-recognition call downloads pretrained model weights
  (~100MB for Facenet512) to `~/.deepface/weights` — needs internet once.
- We deliberately use DeepFace instead of `face_recognition`/dlib, which
  requires CMake and Visual C++ Build Tools to install on Windows.
- `opencv-python-headless` is used (not `opencv-python`) to avoid pulling in
  Qt GUI DLLs.

## App structure

- **Public pages** (no login): `Attendance Check-in` (selfie check-in/out),
  `My Payslip` (employee looks up their own payslips by employee code).
- **Admin pages** (password-gated, set via `ADMIN_PASSWORD`):
  `Employee Enrollment`, `Attendance Reports`, `Payroll`, `AI Agent`.

See `pages/` for each Streamlit page and `db/`, `services/`, `agent/` for the
backing logic. `db/models.py` has the schema; `services/payroll.py` has the
salary calculation; `agent/graph.py` has the LangGraph bulk-payroll workflow;
`agent/tools.py` has the tools exposed to the chat agent.

## Manual verification checklist

1. Log in as admin with the configured password.
2. Enroll a test employee with 3-5 webcam photos (Employee Enrollment page).
3. On the public Attendance Check-in page, capture that face — confirm
   check-in is marked; capture again immediately — confirm it's ignored as a
   duplicate; capture an unenrolled face — confirm "not recognized".
4. Attendance Reports: filter by employee/date, download Excel/CSV.
5. Payroll: generate a single payslip, verify the PDF's numbers by hand.
6. Payroll: run "for all employees", confirm one payslip per employee.
7. My Payslip: look up the test employee by code, download their payslip.
8. AI Agent: ask "Who was absent yesterday?", "Summarize <name>'s attendance
   this month", "Generate a payslip for <name> for <month>", "Run monthly
   payroll for all employees" — cross-check answers against the DB.
