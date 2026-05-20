from __future__ import annotations

import re
from datetime import datetime
from typing import Any, Dict, Iterable, List, Optional

from parsers.base_parser import Transaction


MONTH_NAMES = {
    "jan": 1,
    "feb": 2,
    "mar": 3,
    "apr": 4,
    "may": 5,
    "jun": 6,
    "jul": 7,
    "aug": 8,
    "sep": 9,
    "sept": 9,
    "oct": 10,
    "nov": 11,
    "dec": 12,
}

CREDIT_WORDS = (
    "deposit",
    "credit",
    "payroll",
    "interest",
    "refund",
    "reversal",
    "incoming",
    "received",
    "mobile deposit",
)

DEBIT_WORDS = (
    "withdrawal",
    "debit",
    "purchase",
    "payment",
    "fee",
    "charge",
    "check",
    "atm",
    "transfer to",
    "ach debit",
    "card",
)

MONEY_PATTERN = re.compile(
    r"(?<![A-Za-z0-9])[$]?\(?[+-]?\d{1,3}(?:,\d{3})*(?:\.\d{2})\)?(?![A-Za-z0-9])"
)


def normalize_money(value: Any) -> Optional[float]:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return round(float(value), 2)

    raw = str(value).strip()
    if not raw or raw in {"-", "--", "\u2014", "N/A"}:
        return None

    negative = raw.startswith("-") or raw.startswith("(") or raw.endswith(")")
    cleaned = (
        raw.replace("$", "")
        .replace(",", "")
        .replace("(", "")
        .replace(")", "")
        .replace("+", "")
        .strip()
    )
    cleaned = re.sub(r"[^0-9.\-]", "", cleaned)
    if cleaned in {"", "-", "."}:
        return None
    try:
        number = float(cleaned)
    except ValueError:
        return None
    if negative and number > 0:
        number = -number
    return round(number, 2)


def extract_money_tokens(text: str) -> List[str]:
    return [match.group(0) for match in MONEY_PATTERN.finditer(text or "")]


def normalize_date(value: Any, statement_year: Optional[int] = None) -> str:
    raw = str(value or "").strip().replace(",", "")
    if not raw:
        return ""

    raw = re.sub(r"\s+", " ", raw)
    formats = (
        "%m/%d/%Y",
        "%m/%d/%y",
        "%m-%d-%Y",
        "%m-%d-%y",
        "%Y-%m-%d",
        "%b %d %Y",
        "%B %d %Y",
        "%d %b %Y",
        "%d %B %Y",
    )
    for fmt in formats:
        try:
            return datetime.strptime(raw, fmt).date().isoformat()
        except ValueError:
            pass

    month_day = re.match(r"^(\d{1,2})[/-](\d{1,2})$", raw)
    if month_day and statement_year:
        month, day = int(month_day.group(1)), int(month_day.group(2))
        try:
            return datetime(statement_year, month, day).date().isoformat()
        except ValueError:
            return raw

    named = re.match(r"^([A-Za-z]{3,9})\s+(\d{1,2})$", raw)
    if named and statement_year:
        month = MONTH_NAMES.get(named.group(1).lower()[:3])
        if month:
            try:
                return datetime(statement_year, month, int(named.group(2))).date().isoformat()
            except ValueError:
                return raw

    return raw


def statement_year_from_period(start: Optional[str], end: Optional[str]) -> Optional[int]:
    for value in (end, start):
        normalized = normalize_date(value)
        if re.match(r"^\d{4}-\d{2}-\d{2}$", normalized):
            return int(normalized[:4])
    return None


def infer_amount_side(description: str, amount: float) -> Dict[str, Optional[float]]:
    if amount < 0:
        return {"debit": abs(amount), "credit": None}

    lowered = description.lower()
    if any(word in lowered for word in CREDIT_WORDS):
        return {"debit": None, "credit": abs(amount)}
    if any(word in lowered for word in DEBIT_WORDS):
        return {"debit": abs(amount), "credit": None}
    return {"debit": None, "credit": abs(amount)}


def clean_transactions(
    rows: Iterable[Dict[str, Any]], statement_year: Optional[int] = None
) -> List[Transaction]:
    transactions: List[Transaction] = []
    last_date = ""

    for index, row in enumerate(rows):
        raw_date = row.get("date") or ""
        normalized_date = normalize_date(raw_date, statement_year)
        if normalized_date:
            last_date = normalized_date
        else:
            normalized_date = last_date

        description = re.sub(r"\s+", " ", str(row.get("description") or "")).strip()
        raw = str(row.get("raw") or description)
        if not description and not raw_date:
            continue

        debit = normalize_money(row.get("debit"))
        credit = normalize_money(row.get("credit"))
        balance = normalize_money(row.get("balance"))
        amount = normalize_money(row.get("amount"))

        if amount is None and debit is None and credit is None:
            tokens = extract_money_tokens(raw)
            if tokens:
                if balance is None and len(tokens) >= 2:
                    balance = normalize_money(tokens[-1])
                    amount = normalize_money(tokens[-2])
                else:
                    amount = normalize_money(tokens[-1])

        if amount is not None and debit is None and credit is None:
            side = infer_amount_side(description, amount)
            debit, credit = side["debit"], side["credit"]

        if debit is not None and debit < 0 and credit is None:
            credit, debit = abs(debit), None
        if credit is not None and credit < 0 and debit is None:
            debit, credit = abs(credit), None

        if not normalized_date and not description:
            continue

        confidence = float(row.get("confidence") or 0.65)
        if not normalized_date:
            confidence -= 0.15
        if debit is None and credit is None:
            confidence -= 0.2

        transactions.append(
            Transaction(
                id=str(row.get("id") or f"txn-{index + 1}"),
                date=normalized_date,
                description=description or "Unlabeled transaction",
                debit=debit,
                credit=credit,
                balance=balance,
                raw=raw,
                confidence=max(0.05, min(confidence, 0.98)),
            )
        )

    return transactions
