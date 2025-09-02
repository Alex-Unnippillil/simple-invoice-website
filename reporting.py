import csv
import datetime as _dt
import io
import json
from collections import defaultdict
from typing import Dict, Iterable, List, Tuple

BUCKETS: List[Tuple[int, int]] = [(0, 30), (31, 60), (61, 90), (91, 10**9)]
BUCKET_LABELS = ["0-30", "31-60", "61-90", "91+"]


def load_invoices(path: str = "data/invoices.json") -> List[Dict]:
    """Load invoices from a JSON file."""
    with open(path) as fh:
        return json.load(fh)


def compute_aging(
    invoices: Iterable[Dict],
    *,
    property: str | None = None,
    organization: str | None = None,
    today: _dt.date | None = None,
) -> Tuple[Dict[str, Dict], Dict[str, float]]:
    """Compute aging buckets for outstanding invoices.

    Returns mapping of bucket label to items and totals plus overall totals.
    """

    if today is None:
        today = _dt.date.today()

    results = {
        label: {"items": [], "total": 0.0} for label in BUCKET_LABELS
    }
    totals = {"total_outstanding": 0.0}

    for inv in invoices:
        if property and inv.get("property") != property:
            continue
        if organization and inv.get("organization") != organization:
            continue

        outstanding = inv.get("amount", 0) - inv.get("paid_amount", 0)
        if outstanding <= 0:
            continue

        due = _dt.date.fromisoformat(inv["due_date"])
        days_overdue = (today - due).days
        if days_overdue < 0:
            # not yet due; treat as 0-30
            days_overdue = 0

        for (start, end), label in zip(BUCKETS, BUCKET_LABELS):
            if start <= days_overdue <= end:
                bucket = results[label]
                bucket["items"].append(
                    {
                        **inv,
                        "outstanding": outstanding,
                        "days_overdue": days_overdue,
                    }
                )
                bucket["total"] += outstanding
                break
        totals["total_outstanding"] += outstanding

    return results, totals


def export_csv(aging: Dict[str, Dict]) -> str:
    """Return CSV string representing the aging summary."""
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Bucket", "Outstanding"])
    for label in BUCKET_LABELS:
        writer.writerow([label, f"{aging[label]['total']:.2f}"])
    return output.getvalue()

from fpdf import FPDF

def export_pdf(aging: Dict[str, Dict]) -> bytes:
    """Return PDF bytes for the aging summary."""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(0, 10, "Aging Report", ln=True)
    for label in BUCKET_LABELS:
        pdf.cell(0, 10, f"{label}: {aging[label]['total']:.2f}", ln=True)
    return pdf.output(dest="S").encode("latin-1")
