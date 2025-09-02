from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from enum import Enum


class ProrationRule(Enum):
    """Rules for prorating rent."""
    ACTUAL_ACTUAL = "actual_actual"
    THIRTY_360 = "30_360"


@dataclass
class Lease:
    start_date: date
    end_date: date | None
    monthly_rent: Decimal
    proration_rule: ProrationRule = ProrationRule.ACTUAL_ACTUAL
