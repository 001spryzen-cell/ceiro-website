# StatementFlow

StatementFlow is a local-first bank statement PDF converter inspired by the BankStatementConverter workflow, with original code and UI. It extracts statement metadata, transactions, and balances, lets you edit the rows, then exports CSV or XLSX files.

## Stack

- Frontend: Next.js, React, Tailwind
- Backend: Python FastAPI
- PDF text extraction: pdfplumber and PyMuPDF
- OCR fallback: pytesseract
- Data processing and export: pandas, openpyxl
- Storage: local `backend/uploads`, `backend/jobs`, and `backend/exports` folders

No API keys or paid APIs are required.

## Requirements

- Python 3.11+
- Node.js 20+
- Tesseract OCR installed locally for scanned PDFs

Selectable-text PDFs work without Tesseract. Scanned/image-only PDFs need Tesseract on your PATH.

## Backend Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API will run at `http://127.0.0.1:8000`.

## Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:3000`.

## Endpoints

- `POST /upload`
- `GET /result/{job_id}`
- `POST /export/csv/{job_id}`
- `POST /export/xlsx/{job_id}`

## Parsing Flow

1. Save the uploaded PDF locally.
2. Check whether the PDF contains selectable text.
3. Use pdfplumber and layout coordinates when selectable text exists.
4. Use PyMuPDF page images and Tesseract OCR when the PDF is image-only.
5. Route to a bank-specific parser when the bank is detected.
6. Fall back to the generic parser when no specific parser matches.
7. Detect transaction tables from extracted tables, positioned words, then plain text.
8. Normalize dates and money values.
9. Validate `beginning balance + credits - debits = ending balance`.
10. Return warnings and low-confidence messages when extraction is uncertain.

If extraction fails, the app shows clearly labeled demo data so the UI remains testable.
