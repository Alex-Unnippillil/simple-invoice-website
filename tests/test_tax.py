import pytest
from organization import Organization
from invoice import Invoice, LineItem
from sync import map_tax_lines, verify_tax_alignment


def test_tax_calculation_and_mapping():
    org = Organization("My Org")
    org.enable_taxes(0.07)

    invoice = Invoice(org, [LineItem("Widget", 100.0)])

    assert invoice.tax_amount() == pytest.approx(7.0)
    mappings = map_tax_lines(invoice)
    assert mappings["qbo"]["tax"] == pytest.approx(7.0)
    assert mappings["xero"]["tax"] == pytest.approx(7.0)
    assert verify_tax_alignment(invoice)
