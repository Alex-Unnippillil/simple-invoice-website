"""Utility for importing Stripe payout data and reconciling invoices/payments.

This module provides a command line interface that can:
- Import a Stripe payout CSV export and a local invoice/payment CSV file.
- Aggregate transactions by payout and flag mismatches between expected and actual amounts.
- Present an interactive reconciliation view where discrepancies can be marked as resolved.
- Export the reconciliation result back to CSV mirroring the Stripe payout report format.

The goal of this script is to provide the core logic requested in the task
statement without depending on external services or a database.  Instead
it operates purely on CSV data supplied at runtime.

Example usage::

    python stripe_reconciliation.py payouts.csv payments.csv output.csv

Both input files are expected to be in CSV format with a header row.  The
``payouts.csv`` file should match the structure of the report that can be
exported from Stripe:

    id,amount,currency
    po_123,10000,usd

The ``payments.csv`` file represents invoices or payments that have been
associated with a payout.  At minimum it requires ``payout_id`` and
``amount`` columns:

    invoice_id,payout_id,amount
    in_1,po_123,5000
    in_2,po_123,5000

After running the script a reconciliation report will be written to
``output.csv`` summarising whether the payments for each payout balance
with the Stripe payout amount.  Any mismatches can be interactively
resolved and the result will reflect the final status.
"""

from __future__ import annotations

import csv
import dataclasses
import sys
from pathlib import Path
from typing import Dict, Iterable, List, Tuple


@dataclasses.dataclass
class Payment:
    """Represents a single invoice/payment tied to a payout."""

    invoice_id: str
    payout_id: str
    amount: int  # Amount in cents to avoid floating point issues


@dataclasses.dataclass
class Payout:
    """Represents a Stripe payout."""

    payout_id: str
    amount: int  # Amount in cents


@dataclasses.dataclass
class ReconciliationResult:
    """Result of reconciling payments against a payout."""

    payout: Payout
    payments: List[Payment]
    difference: int  # Actual payout amount minus sum(payments)
    resolved: bool = False


# ---------------------------------------------------------------------------
# CSV Loading utilities


def load_payouts(path: Path) -> Dict[str, Payout]:
    """Load Stripe payouts from a CSV file."""

    payouts: Dict[str, Payout] = {}
    with path.open(newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                payout_id = row["id"].strip()
                amount = int(row["amount"])
            except (KeyError, ValueError) as exc:  # pragma: no cover - defensive
                raise ValueError(f"Invalid payout row: {row}") from exc
            payouts[payout_id] = Payout(payout_id=payout_id, amount=amount)
    return payouts


def load_payments(path: Path) -> List[Payment]:
    """Load invoice/payments from a CSV file."""

    payments: List[Payment] = []
    with path.open(newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                invoice_id = row["invoice_id"].strip()
                payout_id = row["payout_id"].strip()
                amount = int(row["amount"])
            except (KeyError, ValueError) as exc:  # pragma: no cover
                raise ValueError(f"Invalid payment row: {row}") from exc
            payments.append(Payment(invoice_id=invoice_id, payout_id=payout_id, amount=amount))
    return payments


# ---------------------------------------------------------------------------
# Reconciliation logic


def reconcile(payouts: Dict[str, Payout], payments: Iterable[Payment]) -> Dict[str, ReconciliationResult]:
    """Aggregate payments by payout and compute mismatches.

    Returns a mapping of ``payout_id`` to :class:`ReconciliationResult`.
    """

    grouped: Dict[str, List[Payment]] = {}
    for pay in payments:
        grouped.setdefault(pay.payout_id, []).append(pay)

    results: Dict[str, ReconciliationResult] = {}
    for payout_id, payout in payouts.items():
        related = grouped.get(payout_id, [])
        total = sum(p.amount for p in related)
        results[payout_id] = ReconciliationResult(
            payout=payout,
            payments=related,
            difference=payout.amount - total,
        )
    # Handle payments referencing unknown payouts
    for payout_id, pays in grouped.items():
        if payout_id not in results:
            phantom = Payout(payout_id=payout_id, amount=0)
            total = sum(p.amount for p in pays)
            results[payout_id] = ReconciliationResult(
                payout=phantom,
                payments=pays,
                difference=-total,
            )
    return results


# ---------------------------------------------------------------------------
# Interactive reconciliation


def interactive_reconciliation(results: Dict[str, ReconciliationResult]) -> None:
    """Provide a simple CLI to review and resolve mismatches.

    Users are shown each payout that does not balance.  They can mark it
    as resolved which sets the ``resolved`` flag on the respective
    :class:`ReconciliationResult`.
    """

    for res in results.values():
        if res.difference == 0:
            continue
        print(f"Payout {res.payout.payout_id} has difference {res.difference} cents")
        print("Invoices:")
        for pay in res.payments:
            print(f"  - {pay.invoice_id}: {pay.amount}")
        choice = input("Mark as resolved? [y/N]: ").strip().lower()
        if choice == "y":
            res.resolved = True


# ---------------------------------------------------------------------------
# CSV export


def export_reconciliation(path: Path, results: Dict[str, ReconciliationResult]) -> None:
    """Export reconciliation results to CSV mirroring Stripe's format."""

    fieldnames = ["id", "amount", "difference", "resolved"]
    with path.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for res in results.values():
            writer.writerow(
                {
                    "id": res.payout.payout_id,
                    "amount": res.payout.amount,
                    "difference": res.difference,
                    "resolved": res.resolved,
                }
            )


# ---------------------------------------------------------------------------
# Command line entry point


def main(argv: List[str]) -> int:
    if len(argv) != 4:
        print(
            "Usage: python stripe_reconciliation.py <payouts.csv> <payments.csv> <output.csv>",
            file=sys.stderr,
        )
        return 1

    payouts = load_payouts(Path(argv[1]))
    payments = load_payments(Path(argv[2]))
    results = reconcile(payouts, payments)
    interactive_reconciliation(results)
    export_reconciliation(Path(argv[3]), results)
    print(f"Reconciliation exported to {argv[3]}")
    return 0


if __name__ == "__main__":  # pragma: no cover - CLI entry
    raise SystemExit(main(sys.argv))
