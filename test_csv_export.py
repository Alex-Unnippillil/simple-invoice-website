from datetime import date

from csv_export import Invoice, Payment, invoices_to_csv, payments_to_csv


def test_invoices_to_csv():
    invoices = [
        Invoice(id=1, tenant="Alice", amount=100.0, issued=date(2024, 1, 1)),
        Invoice(id=2, tenant="Bob", amount=150.5, issued=date(2024, 2, 1)),
    ]
    csv_text = invoices_to_csv(invoices)
    lines = csv_text.strip().splitlines()
    assert lines[0] == "id,tenant,amount,issued"
    assert "Alice" in lines[1] and "100.00" in lines[1]


def test_payments_to_csv():
    payments = [
        Payment(invoice_id=1, amount=100.0, paid_on=date(2024, 1, 15)),
    ]
    csv_text = payments_to_csv(payments)
    lines = csv_text.strip().splitlines()
    assert lines[0] == "invoice_id,amount,paid_on"
    assert "1" in lines[1] and "100.00" in lines[1]
