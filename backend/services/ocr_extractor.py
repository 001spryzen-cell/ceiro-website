from __future__ import annotations

from io import BytesIO
from pathlib import Path
from typing import Any, Dict, List, Tuple

import fitz
from PIL import Image
import pytesseract


def extract_text_with_ocr(pdf_path: Path, dpi: int = 220) -> Tuple[List[Dict[str, Any]], List[str]]:
    pages: List[Dict[str, Any]] = []
    warnings: List[str] = []

    try:
        with fitz.open(pdf_path) as document:
            zoom = dpi / 72
            matrix = fitz.Matrix(zoom, zoom)
            for index, page in enumerate(document, start=1):
                pixmap = page.get_pixmap(matrix=matrix, alpha=False)
                image = Image.open(BytesIO(pixmap.tobytes("png")))
                text = pytesseract.image_to_string(image)
                pages.append(
                    {
                        "page_number": index,
                        "width": float(page.rect.width),
                        "height": float(page.rect.height),
                        "text": text,
                        "words": [],
                        "tables": [],
                        "source": "tesseract_ocr",
                    }
                )
    except pytesseract.TesseractNotFoundError:
        warnings.append(
            "Tesseract OCR is not installed or is not on PATH. Scanned PDFs cannot be read until Tesseract is available."
        )
    except Exception as exc:
        warnings.append(f"OCR extraction failed: {exc}")

    return pages, warnings
