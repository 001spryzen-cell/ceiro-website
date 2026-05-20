from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Tuple

import fitz
import pdfplumber


def has_selectable_text(pdf_path: Path, min_chars: int = 40) -> bool:
    try:
        with fitz.open(pdf_path) as document:
            chars = 0
            for page in document:
                chars += len((page.get_text("text") or "").strip())
                if chars >= min_chars:
                    return True
    except Exception:
        pass

    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages[:2])
            return len(text.strip()) >= min_chars
    except Exception:
        return False


def extract_text_and_layout(pdf_path: Path) -> Tuple[List[Dict[str, Any]], List[str]]:
    pages: List[Dict[str, Any]] = []
    warnings: List[str] = []

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for index, page in enumerate(pdf.pages, start=1):
                text = page.extract_text(x_tolerance=1.5, y_tolerance=3) or ""
                try:
                    words = page.extract_words(
                        x_tolerance=1.5,
                        y_tolerance=3,
                        keep_blank_chars=False,
                        use_text_flow=True,
                    )
                except Exception as exc:
                    words = []
                    warnings.append(f"Could not extract layout words on page {index}: {exc}")

                try:
                    tables = page.extract_tables() or []
                except Exception as exc:
                    tables = []
                    warnings.append(f"Could not extract tables on page {index}: {exc}")

                pages.append(
                    {
                        "page_number": index,
                        "width": page.width,
                        "height": page.height,
                        "text": text,
                        "words": words,
                        "tables": tables,
                        "source": "pdfplumber",
                    }
                )
    except Exception as exc:
        warnings.append(f"pdfplumber extraction failed: {exc}")

    if not pages:
        try:
            with fitz.open(pdf_path) as document:
                for index, page in enumerate(document, start=1):
                    pages.append(
                        {
                            "page_number": index,
                            "width": float(page.rect.width),
                            "height": float(page.rect.height),
                            "text": page.get_text("text") or "",
                            "words": [],
                            "tables": [],
                            "source": "pymupdf",
                        }
                    )
        except Exception as exc:
            warnings.append(f"PyMuPDF text extraction failed: {exc}")

    return pages, warnings
