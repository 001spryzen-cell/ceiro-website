from __future__ import annotations

from typing import Optional

from parsers.generic_parser import GenericStatementParser


class TDParser(GenericStatementParser):
    parser_name = "td_bank"
    bank_aliases = ("td bank", "td convenience", "td beyond")

    def detect_bank_name(self, text: str) -> Optional[str]:
        return "TD Bank" if self.can_parse(text) else super().detect_bank_name(text)
