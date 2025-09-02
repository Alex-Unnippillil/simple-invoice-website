from __future__ import annotations

from datetime import date
from decimal import Decimal, ROUND_HALF_UP
import calendar

from .models import ProrationRule


class ProrationService:
    """Service to prorate monthly rent for partial periods."""

    @staticmethod
    def prorate(monthly_rent: Decimal, start: date, end: date, rule: ProrationRule) -> Decimal:
        if start > end:
            raise ValueError("start date must be on or before end date")

        if rule == ProrationRule.ACTUAL_ACTUAL:
            days_in_month = calendar.monthrange(start.year, start.month)[1]
            days = (end - start).days + 1
            daily_rate = monthly_rent / Decimal(days_in_month)
            amount = daily_rate * days
        elif rule == ProrationRule.THIRTY_360:
            # Treat all months as 30 days
            days = 30 - (start.day - 1)
            daily_rate = monthly_rent / Decimal(30)
            amount = daily_rate * days
        else:
            raise ValueError(f"Unsupported proration rule: {rule}")

        return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
