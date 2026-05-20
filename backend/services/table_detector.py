from __future__ import annotations

import re
from collections import defaultdict
from typing import Any, Dict, Iterable, List, Optional, Tuple


DATE_PATTERN = re.compile(
    r"^\s*(?P<date>(?:\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)|(?:\d{4}-\d{1,2}-\d{1,2})|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:,?\s+\d{4})?))\b",
    re.IGNORECASE,
)

MONEY_PATTERN = re.compile(
    r"(?<![A-Za-z0-9])[$]?\(?[+-]?\d{1,3}(?:,\d{3})*(?:\.\d{2})\)?(?![A-Za-z0-9])"
)

HEADER_ALIASES = {
    "date": ("date", "posted", "post date", "transaction date", "trans date"),
    "description": ("description", "details", "transaction", "memo", "payee", "particulars"),
    "debit": ("debit", "withdrawal", "withdrawals", "paid out", "charge", "payment"),
    "credit": ("credit", "deposit", "deposits", "paid in"),
    "amount": ("amount", "amt"),
    "balance": ("balance", "running balance", "daily balance"),
}

STOP_MARKERS = (
    "daily balance",
    "ending balance",
    "account summary",
    "fees charged",
    "interest charged",
    "year-to-date",
    "important information",
    "customer service",
)


def detect_transaction_rows(pages: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[str]]:
    warnings: List[str] = []

    table_rows = _rows_from_pdf_tables(pages)
    if table_rows:
        return table_rows, warnings

    word_rows = _rows_from_word_layout(pages)
    if word_rows:
        return word_rows, warnings

    text_rows = _rows_from_plain_text(pages)
    if text_rows:
        return text_rows, warnings

    warnings.append("No transaction table could be detected with table, layout, or text heuristics.")
    return [], warnings


def _canonical_header(cell: str) -> Optional[str]:
    lowered = re.sub(r"\s+", " ", (cell or "").strip().lower())
    if not lowered:
        return None
    for canonical, aliases in HEADER_ALIASES.items():
        if any(alias == lowered or alias in lowered for alias in aliases):
            return canonical
    return None


def _is_header(cells: Iterable[str]) -> bool:
    headers = set()
    for cell in cells:
        canonical = _canonical_header(cell)
        if canonical:
            headers.add(canonical)
        lowered = re.sub(r"\s+", " ", (cell or "").strip().lower())
        for name, aliases in HEADER_ALIASES.items():
            if any(alias in lowered for alias in aliases):
                headers.add(name)
    return "date" in headers and (
        "description" in headers or "amount" in headers or "debit" in headers or "credit" in headers
    )


def _header_map(cells: List[str]) -> Dict[int, str]:
    mapped: Dict[int, str] = {}
    for index, cell in enumerate(cells):
        canonical = _canonical_header(cell)
        if canonical:
            mapped[index] = canonical
    return mapped


def _rows_from_pdf_tables(pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    detected: List[Dict[str, Any]] = []
    for page in pages:
        for table in page.get("tables") or []:
            rows = [[_clean_cell(cell) for cell in row] for row in table if row]
            header_index = next((idx for idx, row in enumerate(rows) if _is_header(row)), None)
            if header_index is None:
                continue
            mapping = _header_map(rows[header_index])
            last_row: Optional[Dict[str, Any]] = None
            for row_index, row in enumerate(rows[header_index + 1 :], start=header_index + 1):
                if _is_header(row):
                    continue
                raw = " ".join(cell for cell in row if cell)
                if _should_stop(raw):
                    break

                candidate = {"raw": raw, "confidence": 0.86, "source": "pdf_table"}
                for col_index, key in mapping.items():
                    if col_index < len(row):
                        candidate[key] = row[col_index]

                if not candidate.get("date") and not _row_has_money(candidate):
                    if last_row and candidate.get("description"):
                        last_row["description"] = f"{last_row.get('description', '')} {candidate['description']}".strip()
                        last_row["raw"] = f"{last_row.get('raw', '')} {raw}".strip()
                    continue

                if candidate.get("date") or _row_has_money(candidate):
                    detected.append(candidate)
                    last_row = candidate

    return _merge_continuations(detected)


def _rows_from_word_layout(pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    detected: List[Dict[str, Any]] = []

    for page in pages:
        row_groups = _group_words_by_row(page.get("words") or [])
        if not row_groups:
            continue

        active_columns: Optional[Dict[str, Tuple[float, float]]] = None
        last_candidate: Optional[Dict[str, Any]] = None
        for words in row_groups:
            line = " ".join(word.get("text", "") for word in words).strip()
            if not line:
                continue

            if _is_header([line]):
                active_columns = _columns_from_header_words(words, float(page.get("width") or 800))
                continue

            if not active_columns:
                continue
            if _should_stop(line):
                active_columns = None
                continue

            candidate = _candidate_from_positioned_words(words, active_columns)
            candidate["raw"] = line
            candidate["confidence"] = 0.8
            candidate["source"] = "word_layout"

            if not candidate.get("date") and not _row_has_money(candidate):
                if last_candidate and candidate.get("description"):
                    last_candidate["description"] = (
                        f"{last_candidate.get('description', '')} {candidate['description']}".strip()
                    )
                    last_candidate["raw"] = f"{last_candidate.get('raw', '')} {line}".strip()
                continue

            if candidate.get("date") or _row_has_money(candidate):
                detected.append(candidate)
                last_candidate = candidate

    return _merge_continuations(detected)


def _rows_from_plain_text(pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    detected: List[Dict[str, Any]] = []
    active = False
    header_columns: List[str] = []
    last_candidate: Optional[Dict[str, Any]] = None

    for page in pages:
        for raw_line in (page.get("text") or "").splitlines():
            line = re.sub(r"\s+", " ", raw_line).strip()
            if not line:
                continue

            if _is_header([line]):
                active = True
                header_columns = _columns_from_header_line(line)
                continue

            if not active:
                continue
            if _should_stop(line):
                active = False
                continue

            candidate = _candidate_from_text_line(line, header_columns)
            if not candidate.get("date") and not _row_has_money(candidate):
                if last_candidate:
                    last_candidate["description"] = (
                        f"{last_candidate.get('description', '')} {line}".strip()
                    )
                    last_candidate["raw"] = f"{last_candidate.get('raw', '')} {line}".strip()
                continue

            if candidate.get("date") or _row_has_money(candidate):
                detected.append(candidate)
                last_candidate = candidate

    return _merge_continuations(detected)


def _clean_cell(value: Any) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def _row_has_money(row: Dict[str, Any]) -> bool:
    for key in ("debit", "credit", "amount", "balance"):
        value = row.get(key)
        if value not in (None, "") and MONEY_PATTERN.search(str(value)):
            return True
    return bool(MONEY_PATTERN.search(str(row.get("raw") or "")))


def _should_stop(line: str) -> bool:
    lowered = line.lower()
    return any(marker in lowered for marker in STOP_MARKERS)


def _group_words_by_row(words: List[Dict[str, Any]], tolerance: float = 4.0) -> List[List[Dict[str, Any]]]:
    if not words:
        return []
    buckets: Dict[int, List[Dict[str, Any]]] = defaultdict(list)
    for word in words:
        top = float(word.get("top") or word.get("y0") or 0)
        bucket = round(top / tolerance)
        buckets[bucket].append(word)
    rows = []
    for _, row_words in sorted(buckets.items()):
        rows.append(sorted(row_words, key=lambda item: float(item.get("x0") or 0)))
    return rows


def _columns_from_header_words(words: List[Dict[str, Any]], page_width: float) -> Dict[str, Tuple[float, float]]:
    centers: List[Tuple[str, float]] = []
    used: set[str] = set()
    for word in words:
        text = str(word.get("text") or "")
        canonical = _canonical_header(text)
        if canonical and canonical not in used:
            x0 = float(word.get("x0") or 0)
            x1 = float(word.get("x1") or x0)
            centers.append((canonical, (x0 + x1) / 2))
            used.add(canonical)

    centers.sort(key=lambda item: item[1])
    columns: Dict[str, Tuple[float, float]] = {}
    for index, (name, center) in enumerate(centers):
        left = 0 if index == 0 else (centers[index - 1][1] + center) / 2
        right = page_width if index == len(centers) - 1 else (center + centers[index + 1][1]) / 2
        columns[name] = (left, right)
    return columns


def _candidate_from_positioned_words(
    words: List[Dict[str, Any]], columns: Dict[str, Tuple[float, float]]
) -> Dict[str, Any]:
    by_column: Dict[str, List[str]] = defaultdict(list)
    for word in words:
        text = str(word.get("text") or "")
        x0 = float(word.get("x0") or 0)
        x1 = float(word.get("x1") or x0)
        center = (x0 + x1) / 2
        for name, (left, right) in columns.items():
            if left <= center < right:
                by_column[name].append(text)
                break

    candidate = {name: " ".join(values).strip() for name, values in by_column.items()}
    if not candidate.get("description"):
        non_money = [
            word.get("text", "")
            for word in words
            if not MONEY_PATTERN.search(str(word.get("text", ""))) and not DATE_PATTERN.match(str(word.get("text", "")))
        ]
        candidate["description"] = " ".join(non_money).strip()
    return candidate


def _columns_from_header_line(line: str) -> List[str]:
    positions: List[Tuple[int, str]] = []
    lowered = line.lower()
    for name, aliases in HEADER_ALIASES.items():
        for alias in aliases:
            index = lowered.find(alias)
            if index >= 0:
                positions.append((index, name))
                break
    return [name for _, name in sorted(positions)]


def _candidate_from_text_line(line: str, header_columns: List[str]) -> Dict[str, Any]:
    candidate: Dict[str, Any] = {
        "raw": line,
        "description": line,
        "confidence": 0.62,
        "source": "plain_text",
    }

    date_match = DATE_PATTERN.match(line)
    content = line
    if date_match:
        candidate["date"] = date_match.group("date")
        content = line[date_match.end() :].strip()

    money_matches = list(MONEY_PATTERN.finditer(content))
    if money_matches:
        first_money = money_matches[0]
        candidate["description"] = content[: first_money.start()].strip(" -|")
        tokens = [match.group(0) for match in money_matches]

        if "balance" in header_columns and len(tokens) >= 2:
            candidate["balance"] = tokens[-1]
            tokens = tokens[:-1]

        if len(tokens) >= 2 and "debit" in header_columns and "credit" in header_columns:
            candidate["debit"] = tokens[-2]
            candidate["credit"] = tokens[-1]
        elif tokens:
            amount_token = tokens[-1]
            lowered = candidate.get("description", "").lower()
            if "debit" in header_columns and "credit" not in header_columns:
                candidate["debit"] = amount_token
            elif "credit" in header_columns and "debit" not in header_columns:
                candidate["credit"] = amount_token
            elif any(word in lowered for word in ("deposit", "credit", "interest", "refund", "payroll")):
                candidate["credit"] = amount_token
            else:
                candidate["amount"] = amount_token
    else:
        candidate["description"] = content.strip()

    return candidate


def _merge_continuations(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    merged: List[Dict[str, Any]] = []
    last_date = ""
    for row in rows:
        if not row.get("date") and last_date:
            row["date"] = last_date
        elif row.get("date"):
            last_date = str(row["date"])
        merged.append(row)
    return merged
