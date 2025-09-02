from __future__ import annotations

from datetime import date
from decimal import Decimal, ROUND_HALF_UP

from .models import Lease
from .proration import ProrationService


def generate_invoice(lease: Lease, period_start: date, period_end: date) -> Decimal:
    """Generate invoice amount for the given period."""
    if period_start > period_end:
        raise ValueError("period start must be on or before period end")

    amount: Decimal

    if lease.start_date > period_start:
        # Move-in within the period
        amount = ProrationService.prorate(
            lease.monthly_rent, lease.start_date, period_end, lease.proration_rule
        )
    elif lease.end_date is not None and lease.end_date < period_end:
        # Move-out within the period
        amount = ProrationService.prorate(
            lease.monthly_rent, period_start, lease.end_date, lease.proration_rule
        )
    else:
        amount = lease.monthly_rent

    return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
