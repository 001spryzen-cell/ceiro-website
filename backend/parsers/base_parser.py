from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class Transaction:
    id: str
    date: str
    description: str
    debit: Optional[float] = None
    credit: Optional[float] = None
    balance: Optional[float] = None
    raw: str = ""
    confidence: float = 0.7

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ParsedStatement:
    bank_name: Optional[str] = None
    account_holder_name: Optional[str] = None
    account_number_last4: Optional[str] = None
    statement_period_start: Optional[str] = None
    statement_period_end: Optional[str] = None
    beginning_balance: Optional[float] = None
    ending_balance: Optional[float] = None
    transactions: List[Transaction] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    parser_name: str = "generic"
    confidence: float = 0.0
    is_demo_data: bool = False

    def to_dict(self) -> Dict[str, Any]:
        payload = asdict(self)
        payload["transactions"] = [txn.to_dict() for txn in self.transactions]
        return payload


class BaseStatementParser:
    parser_name = "base"
    bank_aliases: tuple[str, ...] = ()

    def can_parse(self, full_text: str) -> bool:
        lowered = full_text.lower()
        return any(alias in lowered for alias in self.bank_aliases)

    def parse(self, pages: List[Dict[str, Any]], metadata: Dict[str, Any]) -> ParsedStatement:
        raise NotImplementedError
