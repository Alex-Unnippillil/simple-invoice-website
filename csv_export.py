from dataclasses import dataclass
from datetime import date
from typing import Iterable
import csv
import io


@dataclass
class Invoice:
    """Simple representation of an invoice."""
    id: int
    tenant: str
    amount: float
    issued: date


@dataclass
class Payment:
    """Simple representation of a payment."""
    invoice_id: int
    amount: float
    paid_on: date


def invoices_to_csv(invoices: Iterable[Invoice]) -> str:
    """Return CSV data for the given invoices."""
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=["id", "tenant", "amount", "issued"])
    writer.writeheader()
    for inv in invoices:
        writer.writerow({
            "id": inv.id,
            "tenant": inv.tenant,
            "amount": f"{inv.amount:.2f}",
            "issued": inv.issued.isoformat(),
        })
    return output.getvalue()


def payments_to_csv(payments: Iterable[Payment]) -> str:
    """Return CSV data for the given payments."""
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=["invoice_id", "amount", "paid_on"])
    writer.writeheader()
    for pay in payments:
        writer.writerow({
            "invoice_id": pay.invoice_id,
            "amount": f"{pay.amount:.2f}",
            "paid_on": pay.paid_on.isoformat(),
        })
    return output.getvalue()
