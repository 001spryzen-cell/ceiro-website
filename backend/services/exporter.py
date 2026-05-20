from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List

import pandas as pd


EXPORT_COLUMNS = ["date", "description", "debit", "credit", "balance"]


def transactions_to_dataframe(transactions: List[Dict[str, Any]]) -> pd.DataFrame:
    rows = []
    for transaction in transactions:
        rows.append({column: transaction.get(column) for column in EXPORT_COLUMNS})
    return pd.DataFrame(rows, columns=EXPORT_COLUMNS)


def export_csv(job_id: str, transactions: List[Dict[str, Any]], export_dir: Path) -> Path:
    export_dir.mkdir(parents=True, exist_ok=True)
    output_path = export_dir / f"{job_id}.csv"
    dataframe = transactions_to_dataframe(transactions)
    dataframe.to_csv(output_path, index=False)
    return output_path


def export_xlsx(
    job_id: str,
    transactions: List[Dict[str, Any]],
    statement: Dict[str, Any],
    validation: Dict[str, Any],
    export_dir: Path,
) -> Path:
    export_dir.mkdir(parents=True, exist_ok=True)
    output_path = export_dir / f"{job_id}.xlsx"
    dataframe = transactions_to_dataframe(transactions)

    summary_rows = [
        {"field": "Bank name", "value": statement.get("bank_name")},
        {"field": "Account holder", "value": statement.get("account_holder_name")},
        {"field": "Account last 4", "value": statement.get("account_number_last4")},
        {"field": "Statement start", "value": statement.get("statement_period_start")},
        {"field": "Statement end", "value": statement.get("statement_period_end")},
        {"field": "Beginning balance", "value": statement.get("beginning_balance")},
        {"field": "Ending balance", "value": statement.get("ending_balance")},
        {"field": "Validation", "value": validation.get("message")},
    ]

    with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
        dataframe.to_excel(writer, sheet_name="Transactions", index=False)
        pd.DataFrame(summary_rows).to_excel(writer, sheet_name="Statement Summary", index=False)

        workbook = writer.book
        for worksheet in workbook.worksheets:
            for column_cells in worksheet.columns:
                max_length = max(len(str(cell.value or "")) for cell in column_cells)
                worksheet.column_dimensions[column_cells[0].column_letter].width = min(max(max_length + 2, 12), 48)

    return output_path
