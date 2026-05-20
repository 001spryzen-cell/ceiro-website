from __future__ import annotations

import re
from typing import Any, Dict, List, Optional, Tuple

from parsers.base_parser import BaseStatementParser, ParsedStatement
from services.table_detector import detect_transaction_rows
from services.transaction_cleaner import clean_transactions, normalize_date, normalize_money, statement_year_from_period


BANK_KEYWORDS = (
    "capital one",
    "regions",
    "td bank",
    "relay",
    "chase",
    "bank of america",
    "wells fargo",
    "citibank",
    "us bank",
    "pnc bank",
)


class GenericStatementParser(BaseStatementParser):
    parser_name = "generic"

    def parse(self, pages: List[Dict[str, Any]], metadata: Dict[str, Any]) -> ParsedStatement:
        full_text = "\n".join(page.get("text") or "" for page in pages)
        statement = ParsedStatement(parser_name=self.parser_name)
        statement.bank_name = self.detect_bank_name(full_text)
        statement.account_holder_name = self.detect_account_holder(full_text)
        statement.account_number_last4 = self.detect_account_last4(full_text)

        period_start, period_end = self.detect_statement_period(full_text)
        statement.statement_period_start = normalize_date(period_start) if period_start else None
        statement.statement_period_end = normalize_date(period_end) if period_end else None

        statement.beginning_balance = self.detect_balance(full_text, beginning=True)
        statement.ending_balance = self.detect_balance(full_text, beginning=False)

        rows, table_warnings = detect_transaction_rows(pages)
        statement.warnings.extend(table_warnings)
        year = statement_year_from_period(statement.statement_period_start, statement.statement_period_end)
        statement.transactions = clean_transactions(rows, statement_year=year)

        statement.confidence = self.estimate_confidence(statement)
        if not statement.transactions:
            statement.warnings.append("No transactions were extracted from the statement.")
        if statement.confidence < 0.55:
            statement.warnings.append("Extraction confidence is low. Please review the editable table carefully.")
        return statement

    def detect_bank_name(self, text: str) -> Optional[str]:
        lowered = text.lower()
        for keyword in BANK_KEYWORDS:
            if keyword in lowered:
                return keyword.title().replace("Td", "TD").replace("Us Bank", "US Bank")

        for line in text.splitlines()[:12]:
            clean = re.sub(r"\s+", " ", line).strip()
            if 3 <= len(clean) <= 50 and "statement" not in clean.lower() and any(char.isalpha() for char in clean):
                return clean
        return None

    def detect_account_holder(self, text: str) -> Optional[str]:
        patterns = (
            r"(?:account holder|primary account owner|customer name|name)\s*[:\-]\s*(?P<name>[A-Z][A-Za-z ,.'\-]{2,80})",
            r"(?:prepared for|statement for)\s+(?P<name>[A-Z][A-Za-z ,.'\-]{2,80})",
        )
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return _clean_name(match.group("name"))

        lines = [re.sub(r"\s+", " ", line).strip() for line in text.splitlines()]
        for index, line in enumerate(lines):
            if re.search(r"account holder|primary account owner|customer name", line, re.IGNORECASE):
                for candidate in lines[index + 1 : index + 4]:
                    if candidate and re.match(r"^[A-Z][A-Za-z ,.'\-]{2,80}$", candidate):
                        return _clean_name(candidate)
        return None

    def detect_account_last4(self, text: str) -> Optional[str]:
        patterns = (
            r"(?:account|acct)(?:\s+number|\s+#| no\.?)?\s*[:\-]?\s*(?:x{2,}|X{2,}|\*{2,}|ending(?:\s+in)?|last\s+4)?\s*(?P<digits>\d{4})\b",
            r"\b(?:x{4,}|\*{4,})\s*(?P<digits>\d{4})\b",
            r"\bending\s+in\s+(?P<digits>\d{4})\b",
        )
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group("digits")
        return None

    def detect_statement_period(self, text: str) -> Tuple[Optional[str], Optional[str]]:
        date = r"(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}|\d{4}-\d{1,2}-\d{1,2})"
        patterns = (
            rf"(?:statement period|period covered|statement dates?)\s*[:\-]?\s*(?P<start>{date})\s*(?:to|through|-|\u2013)\s*(?P<end>{date})",
            rf"(?:from)\s+(?P<start>{date})\s+(?:to|through)\s+(?P<end>{date})",
            rf"(?P<start>{date})\s*(?:to|through|-|\u2013)\s*(?P<end>{date})",
        )
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group("start"), match.group("end")

        ending = re.search(rf"(?:statement ending|period ending|closing date)\s*[:\-]?\s*(?P<end>{date})", text, re.IGNORECASE)
        if ending:
            return None, ending.group("end")
        return None, None

    def detect_balance(self, text: str, beginning: bool) -> Optional[float]:
        labels = (
            ("beginning balance", "opening balance", "previous balance", "starting balance")
            if beginning
            else ("ending balance", "closing balance", "new balance", "current balance")
        )
        money = r"[$]?\(?[+-]?\d{1,3}(?:,\d{3})*(?:\.\d{2})\)?"
        for label in labels:
            pattern = rf"{label}\s*[:\-]?\s*(?P<amount>{money})"
            matches = list(re.finditer(pattern, text, re.IGNORECASE))
            if matches:
                return normalize_money(matches[-1].group("amount"))
        return None

    def estimate_confidence(self, statement: ParsedStatement) -> float:
        score = 0.25
        if statement.bank_name:
            score += 0.08
        if statement.statement_period_start or statement.statement_period_end:
            score += 0.12
        if statement.beginning_balance is not None:
            score += 0.12
        if statement.ending_balance is not None:
            score += 0.12
        if statement.transactions:
            score += min(0.3, len(statement.transactions) / 100)
            avg_row_confidence = sum(txn.confidence for txn in statement.transactions) / len(statement.transactions)
            score += avg_row_confidence * 0.2
        return round(min(score, 0.98), 2)


def _clean_name(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip(" :-")
