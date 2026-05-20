from __future__ import annotations

from typing import Optional

from parsers.generic_parser import GenericStatementParser


class RelayParser(GenericStatementParser):
    parser_name = "relay"
    bank_aliases = ("relay", "relay financial")

    def detect_bank_name(self, text: str) -> Optional[str]:
        return "Relay" if self.can_parse(text) else super().detect_bank_name(text)
