from datetime import date
from decimal import Decimal

from invoice.models import Lease, ProrationRule
from invoice.invoice_generation import generate_invoice


def test_mid_month_move_in_actual_actual():
    lease = Lease(
        start_date=date(2023, 7, 10),
        end_date=None,
        monthly_rent=Decimal("1000.00"),
        proration_rule=ProrationRule.ACTUAL_ACTUAL,
    )
    amount = generate_invoice(lease, date(2023, 7, 1), date(2023, 7, 31))
    assert amount == Decimal("709.68")


def test_mid_month_move_in_30_360():
    lease = Lease(
        start_date=date(2023, 7, 10),
        end_date=None,
        monthly_rent=Decimal("1000.00"),
        proration_rule=ProrationRule.THIRTY_360,
    )
    amount = generate_invoice(lease, date(2023, 7, 1), date(2023, 7, 31))
    assert amount == Decimal("700.00")
