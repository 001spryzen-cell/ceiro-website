from __future__ import annotations

from typing import Optional

from parsers.generic_parser import GenericStatementParser


class CapitalOneParser(GenericStatementParser):
    parser_name = "capital_one"
    bank_aliases = ("capital one", "capitalone")

    def detect_bank_name(self, text: str) -> Optional[str]:
        return "Capital One" if self.can_parse(text) else super().detect_bank_name(text)
