from __future__ import annotations

from typing import Optional

from parsers.generic_parser import GenericStatementParser


class RegionsParser(GenericStatementParser):
    parser_name = "regions"
    bank_aliases = ("regions bank", "regions")

    def detect_bank_name(self, text: str) -> Optional[str]:
        return "Regions Bank" if self.can_parse(text) else super().detect_bank_name(text)
