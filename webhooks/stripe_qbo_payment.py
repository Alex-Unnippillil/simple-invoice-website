"""Webhook handler for Stripe payments with QuickBooks integration.

On successful Stripe payment events, this module creates a corresponding
QuickBooks Online (QBO) `ReceivePayment` transaction and links it to the
related invoice. Local invoice and payment records are updated with QBO
references to keep the systems in sync. The module also exposes a helper to
check reconciliation status and includes logging plus retry logic to handle
API failures gracefully.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Dict

from tenacity import retry, stop_after_attempt, wait_exponential

try:  # Imported for type hints and runtime if available
    import stripe  # type: ignore
    from quickbooks import QuickBooks  # type: ignore
    from quickbooks.objects.payment import Payment  # type: ignore
except Exception:  # pragma: no cover - allows compilation without deps
    stripe = None  # type: ignore
    QuickBooks = None  # type: ignore
    Payment = None  # type: ignore

logger = logging.getLogger(__name__)


@dataclass
class LocalRecordManager:
    """Tiny abstraction representing local persistence layer.

    In a real application this would wrap database calls. Only the methods
    used by this module are defined here to keep the example self-contained.
    """

    def update_invoice_qbo_id(self, invoice_id: str, qbo_invoice_id: str) -> None:
        logger.debug("Linking local invoice %s -> QBO invoice %s", invoice_id, qbo_invoice_id)

    def update_payment_qbo_id(self, payment_id: str, qbo_payment_id: str) -> None:
        logger.debug("Linking local payment %s -> QBO payment %s", payment_id, qbo_payment_id)


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=2, min=2, max=10))
def _save_payment(payment: Payment, qb_client: QuickBooks) -> Payment:
    """Persist the payment to QBO with retries on failure."""
    logger.info("Saving payment to QBO...")
    return payment.save(qb_client)


def handle_stripe_payment(event: Dict[str, Any], qb_client: QuickBooks, records: LocalRecordManager) -> str:
    """React to a successful Stripe payment webhook event.

    Parameters
    ----------
    event:
        Raw Stripe event payload decoded as a dictionary.
    qb_client:
        Authenticated QuickBooks client instance.
    records:
        Local persistence manager used to update invoice/payment rows.

    Returns
    -------
    str
        The newly created QBO payment ID.
    """

    logger.debug("Handling Stripe event: %s", event.get("id"))
    charge = event["data"]["object"]
    invoice_id = charge["metadata"].get("invoice_id")
    qbo_invoice_id = charge["metadata"].get("qbo_invoice_id")

    payment = Payment()
    payment.CustomerRef = {"value": charge["customer"]}
    payment.TotalAmt = charge["amount_paid"] / 100.0
    payment.Line = [
        {
            "Amount": payment.TotalAmt,
            "LinkedTxn": [{"TxnId": qbo_invoice_id, "TxnType": "Invoice"}],
        }
    ]

    saved = _save_payment(payment, qb_client)
    records.update_invoice_qbo_id(invoice_id, qbo_invoice_id)
    records.update_payment_qbo_id(charge["id"], saved.Id)

    logger.info("Created QBO payment %s for invoice %s", saved.Id, qbo_invoice_id)
    return saved.Id


def check_reconciliation_status(payment_id: str, qb_client: QuickBooks) -> bool:
    """Return True if the payment has been reconciled in QBO."""
    payment = Payment.get(payment_id, qb_client)
    return bool(getattr(payment, "ProcessPayment", False))
