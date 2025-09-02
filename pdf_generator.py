from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Optional

from reportlab.lib.colors import Color, red, green
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


@dataclass
class Invoice:
    """Simple invoice representation used for PDF generation."""

    invoice_id: str
    client_name: str
    amount: float
    due_date: date
    paid_date: Optional[date] = None

    def status(self, today: Optional[date] = None) -> str:
        """Return payment status.

        * "PAID"     - if a paid date exists.
        * "OVERDUE"  - if today is after the due date.
        * "DUE"      - otherwise.
        """
        today = today or date.today()
        if self.paid_date:
            return "PAID"
        if today > self.due_date:
            return "OVERDUE"
        return "DUE"


def _draw_watermark(c: canvas.Canvas, status: str) -> None:
    """Draw a translucent watermark describing *status*.

    The watermark uses a low alpha channel so it does not obscure
    document contents.  Distinct colours are used to aid recognition
    for screen readers and high contrast modes.
    """
    width, height = A4

    colour = green if status == "PAID" else red
    watermark_colour = Color(colour.red, colour.green, colour.blue, alpha=0.15)

    c.saveState()
    c.setFillColor(watermark_colour)
    c.setFont("Helvetica-Bold", 100)
    c.translate(width / 2, height / 2)
    c.rotate(45)
    c.drawCentredString(0, 0, status)
    c.restoreState()


def generate_invoice_pdf(invoice: Invoice, path: str | Path) -> None:
    """Generate a PDF invoice and add an accessibility friendly watermark."""
    c = canvas.Canvas(str(path), pagesize=A4)
    width, height = A4

    # Basic invoice information
    c.setFont("Helvetica", 12)
    y = height - 72
    c.drawString(72, y, f"Invoice: {invoice.invoice_id}")
    y -= 24
    c.drawString(72, y, f"Client: {invoice.client_name}")
    y -= 24
    c.drawString(72, y, f"Amount due: ${invoice.amount:,.2f}")
    y -= 24
    c.drawString(72, y, f"Due date: {invoice.due_date.isoformat()}")
    if invoice.paid_date:
        y -= 24
        c.drawString(72, y, f"Paid date: {invoice.paid_date.isoformat()}")

    status = invoice.status()
    if status in {"PAID", "OVERDUE"}:
        _draw_watermark(c, status)

    c.showPage()
    c.save()


if __name__ == "__main__":
    # Create a sample invoice for manual testing
    sample = Invoice(
        invoice_id="INV-001",
        client_name="Jane Doe",
        amount=1200.0,
        due_date=date.today(),
        paid_date=None,
    )
    generate_invoice_pdf(sample, "sample_invoice.pdf")
    print("Generated sample_invoice.pdf")
