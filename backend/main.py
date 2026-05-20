from __future__ import annotations

import json
import shutil
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import Body, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from parsers.base_parser import ParsedStatement, Transaction
from parsers.capital_one_parser import CapitalOneParser
from parsers.generic_parser import GenericStatementParser
from parsers.regions_parser import RegionsParser
from parsers.relay_parser import RelayParser
from parsers.td_parser import TDParser
from services.balance_validator import validate_balances
from services.exporter import export_csv, export_xlsx
from services.ocr_extractor import extract_text_with_ocr
from services.pdf_text_extractor import extract_text_and_layout, has_selectable_text


BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
JOB_DIR = BASE_DIR / "jobs"
EXPORT_DIR = BASE_DIR / "exports"

for directory in (UPLOAD_DIR, JOB_DIR, EXPORT_DIR):
    directory.mkdir(parents=True, exist_ok=True)


app = FastAPI(title="StatementFlow Converter API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TransactionPayload(BaseModel):
    id: Optional[str] = None
    date: Optional[str] = ""
    description: Optional[str] = ""
    debit: Optional[float] = None
    credit: Optional[float] = None
    balance: Optional[float] = None
    raw: Optional[str] = ""
    confidence: Optional[float] = 0.7


class ExportPayload(BaseModel):
    statement: Optional[Dict[str, Any]] = None
    transactions: Optional[List[TransactionPayload]] = None


PARSERS = [
    CapitalOneParser(),
    RegionsParser(),
    RelayParser(),
    TDParser(),
    GenericStatementParser(),
]


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/upload")
async def upload_statement(file: UploadFile = File(...)) -> Dict[str, Any]:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF bank statement.")

    job_id = uuid.uuid4().hex
    safe_name = Path(file.filename).name
    pdf_path = UPLOAD_DIR / f"{job_id}_{safe_name}"
    with pdf_path.open("wb") as output:
        shutil.copyfileobj(file.file, output)

    try:
        result = process_pdf(job_id=job_id, filename=safe_name, pdf_path=pdf_path)
    except Exception as exc:
        result = demo_result(job_id, safe_name, [f"Extraction failed: {exc}"])

    save_job(job_id, result)
    return result


@app.get("/result/{job_id}")
def get_result(job_id: str) -> Dict[str, Any]:
    return load_job(job_id)


@app.post("/export/csv/{job_id}")
def export_csv_endpoint(
    job_id: str,
    payload: Optional[ExportPayload] = Body(default=None),
) -> FileResponse:
    data = prepare_export_data(job_id, payload)
    output_path = export_csv(job_id, data["transactions"], EXPORT_DIR)
    return FileResponse(output_path, filename=f"{job_id}_transactions.csv", media_type="text/csv")


@app.post("/export/xlsx/{job_id}")
def export_xlsx_endpoint(
    job_id: str,
    payload: Optional[ExportPayload] = Body(default=None),
) -> FileResponse:
    data = prepare_export_data(job_id, payload)
    output_path = export_xlsx(
        job_id,
        data["transactions"],
        data["statement"],
        data["validation"],
        EXPORT_DIR,
    )
    return FileResponse(
        output_path,
        filename=f"{job_id}_statement.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


def process_pdf(job_id: str, filename: str, pdf_path: Path) -> Dict[str, Any]:
    warnings: List[str] = []
    selectable = has_selectable_text(pdf_path)
    if selectable:
        pages, extraction_warnings = extract_text_and_layout(pdf_path)
        extraction_source = "pdfplumber"
    else:
        pages, extraction_warnings = extract_text_with_ocr(pdf_path)
        extraction_source = "tesseract_ocr"

    warnings.extend(extraction_warnings)
    if not pages or not "\n".join(page.get("text") or "" for page in pages).strip():
        return demo_result(
            job_id,
            filename,
            warnings + ["No readable text was found in the PDF, so demo data is shown instead."],
        )

    parser = choose_parser(pages)
    parsed = parser.parse(pages, metadata={"filename": filename, "job_id": job_id})
    parsed.warnings = warnings + parsed.warnings

    if not parsed.transactions:
        return demo_result(
            job_id,
            filename,
            parsed.warnings + ["Transaction extraction failed, so demo data is shown instead."],
        )

    statement = parsed.to_dict()
    transactions = statement.pop("transactions")
    validation = validate_balances(
        statement.get("beginning_balance"),
        statement.get("ending_balance"),
        transactions,
    )
    if not validation["is_valid"]:
        statement["warnings"].append(validation["message"])

    return {
        "job_id": job_id,
        "filename": filename,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "selectable_text": selectable,
        "extraction_source": extraction_source,
        "statement": statement,
        "transactions": transactions,
        "validation": validation,
        "warnings": statement.get("warnings", []),
        "is_demo_data": statement.get("is_demo_data", False),
    }


def choose_parser(pages: List[Dict[str, Any]]):
    full_text = "\n".join(page.get("text") or "" for page in pages)
    for parser in PARSERS:
        if parser.parser_name != "generic" and parser.can_parse(full_text):
            return parser
    return PARSERS[-1]


def demo_result(job_id: str, filename: str, warnings: List[str]) -> Dict[str, Any]:
    transactions = [
        Transaction(
            id="demo-1",
            date="2026-01-03",
            description="Demo opening payroll deposit",
            debit=None,
            credit=2500.00,
            balance=4250.00,
            raw="Demo data",
            confidence=0.1,
        ).to_dict(),
        Transaction(
            id="demo-2",
            date="2026-01-05",
            description="Demo debit card purchase",
            debit=84.27,
            credit=None,
            balance=4165.73,
            raw="Demo data",
            confidence=0.1,
        ).to_dict(),
        Transaction(
            id="demo-3",
            date="2026-01-12",
            description="Demo utility payment",
            debit=126.10,
            credit=None,
            balance=4039.63,
            raw="Demo data",
            confidence=0.1,
        ).to_dict(),
        Transaction(
            id="demo-4",
            date="2026-01-25",
            description="Demo customer transfer",
            debit=None,
            credit=300.00,
            balance=4339.63,
            raw="Demo data",
            confidence=0.1,
        ).to_dict(),
    ]
    statement = ParsedStatement(
        bank_name="Demo Bank",
        account_holder_name="Demo Data",
        account_number_last4="0000",
        statement_period_start="2026-01-01",
        statement_period_end="2026-01-31",
        beginning_balance=1750.00,
        ending_balance=4339.63,
        transactions=[],
        warnings=[
            "Demo data is displayed because the uploaded statement could not be extracted with enough confidence.",
            *warnings,
        ],
        parser_name="demo_fallback",
        confidence=0.1,
        is_demo_data=True,
    ).to_dict()
    statement.pop("transactions", None)
    validation = validate_balances(statement["beginning_balance"], statement["ending_balance"], transactions)
    return {
        "job_id": job_id,
        "filename": filename,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "selectable_text": False,
        "extraction_source": "demo_fallback",
        "statement": statement,
        "transactions": transactions,
        "validation": validation,
        "warnings": statement["warnings"],
        "is_demo_data": True,
    }


def job_path(job_id: str) -> Path:
    if not job_id or not all(char.isalnum() or char in {"-", "_"} for char in job_id):
        raise HTTPException(status_code=400, detail="Invalid job id.")
    return JOB_DIR / f"{job_id}.json"


def save_job(job_id: str, payload: Dict[str, Any]) -> None:
    with job_path(job_id).open("w", encoding="utf-8") as output:
        json.dump(payload, output, indent=2)


def load_job(job_id: str) -> Dict[str, Any]:
    path = job_path(job_id)
    if not path.exists():
        raise HTTPException(status_code=404, detail="Result was not found for that job id.")
    with path.open("r", encoding="utf-8") as input_file:
        return json.load(input_file)


def prepare_export_data(job_id: str, payload: Optional[ExportPayload]) -> Dict[str, Any]:
    data = load_job(job_id)
    statement = payload.statement if payload and payload.statement is not None else data["statement"]
    if payload and payload.transactions is not None:
        transactions = [transaction.model_dump() for transaction in payload.transactions]
    else:
        transactions = data["transactions"]

    validation = validate_balances(
        statement.get("beginning_balance"),
        statement.get("ending_balance"),
        transactions,
    )

    data["statement"] = statement
    data["transactions"] = transactions
    data["validation"] = validation
    save_job(job_id, data)
    return data
