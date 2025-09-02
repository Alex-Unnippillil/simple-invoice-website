from typing import Dict
from invoice import Invoice


def map_tax_lines(invoice: Invoice) -> Dict[str, Dict[str, float]]:
    """Map the invoice's tax lines for QBO and Xero."""
    tax = invoice.tax_amount()
    subtotal = invoice.subtotal()
    total = invoice.total()
    return {
        "qbo": {"tax": tax, "subtotal": subtotal, "total": total},
        "xero": {"tax": tax, "subtotal": subtotal, "total": total},
    }


def verify_tax_alignment(invoice: Invoice) -> bool:
    """Verify that the tax amount matches across systems."""
    mappings = map_tax_lines(invoice)
    invoice_tax = invoice.tax_amount()
    return all(abs(m["tax"] - invoice_tax) < 1e-9 for m in mappings.values())
