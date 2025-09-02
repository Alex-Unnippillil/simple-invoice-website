import datetime as dt
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from reporting import compute_aging


def test_compute_aging_buckets():
    invoices = [
        {"amount": 100, "paid_amount": 0, "due_date": "2024-01-25", "organization": "OrgA", "property": "Prop1"},
        {"amount": 200, "paid_amount": 50, "due_date": "2023-12-01", "organization": "OrgA", "property": "Prop1"},
        {"amount": 300, "paid_amount": 0, "due_date": "2023-09-01", "organization": "OrgB", "property": "Prop2"},
    ]
    today = dt.date(2024, 2, 20)
    aging, totals = compute_aging(invoices, today=today)
    assert totals["total_outstanding"] == 100 + 150 + 300
    assert aging["0-30"]["total"] == 100
    assert aging["61-90"]["total"] == 150
    assert aging["91+"]["total"] == 300
