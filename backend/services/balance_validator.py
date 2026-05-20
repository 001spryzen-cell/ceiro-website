from __future__ import annotations

from typing import Any, Dict, Iterable, Optional


def _as_number(value: Any) -> Optional[float]:
    if value is None or value == "":
        return None
    try:
        return round(float(value), 2)
    except (TypeError, ValueError):
        return None


def validate_balances(
    beginning_balance: Any,
    ending_balance: Any,
    transactions: Iterable[Dict[str, Any] | Any],
) -> Dict[str, Any]:
    beginning = _as_number(beginning_balance)
    ending = _as_number(ending_balance)

    total_debits = 0.0
    total_credits = 0.0
    count = 0
    for transaction in transactions:
        count += 1
        if isinstance(transaction, dict):
            debit = _as_number(transaction.get("debit")) or 0.0
            credit = _as_number(transaction.get("credit")) or 0.0
        else:
            debit = _as_number(getattr(transaction, "debit", None)) or 0.0
            credit = _as_number(getattr(transaction, "credit", None)) or 0.0
        total_debits += debit
        total_credits += credit

    if beginning is None or ending is None:
        return {
            "is_valid": False,
            "status": "missing-balances",
            "message": "Beginning or ending balance was not found, so balance validation could not be completed.",
            "beginning_balance": beginning,
            "ending_balance": ending,
            "calculated_ending_balance": None,
            "difference": None,
            "total_debits": round(total_debits, 2),
            "total_credits": round(total_credits, 2),
            "transaction_count": count,
        }

    calculated = round(beginning + total_credits - total_debits, 2)
    difference = round(calculated - ending, 2)
    is_valid = abs(difference) <= 0.02

    return {
        "is_valid": is_valid,
        "status": "valid" if is_valid else "mismatch",
        "message": (
            "Balances reconcile."
            if is_valid
            else "The extracted transactions do not reconcile to the ending balance."
        ),
        "beginning_balance": beginning,
        "ending_balance": ending,
        "calculated_ending_balance": calculated,
        "difference": difference,
        "total_debits": round(total_debits, 2),
        "total_credits": round(total_credits, 2),
        "transaction_count": count,
    }
