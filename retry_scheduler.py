"""Utilities for scheduling payment retry communications."""

from datetime import datetime, timedelta
from cadence_admin import get_cadence


def schedule_retries(invoice, failure_date=None, schedule=None):
    """Populate an invoice with scheduled retry communications.

    Parameters
    ----------
    invoice: Invoice
        target invoice object.
    failure_date: datetime, optional
        date the payment failed. Defaults to now.
    schedule: list[int], optional
        explicit schedule overriding organization cadence.
    """
    failure_date = failure_date or datetime.utcnow()
    schedule = schedule or get_cadence(invoice.organization_id)
    invoice.scheduled_retries = []
    for days in schedule:
        retry_time = failure_date + timedelta(days=days)
        invoice.scheduled_retries.append(retry_time)
        invoice.record_communication(
            channel="schedule",
            status="queued",
            timestamp=retry_time,
            info=f"Retry at {retry_time.isoformat()}"
        )
    return invoice.scheduled_retries


def mark_payment_success(invoice, timestamp=None):
    """Mark invoice as paid and clear outstanding retries."""
    timestamp = timestamp or datetime.utcnow()
    invoice.paid = True
    invoice.scheduled_retries.clear()
    invoice.record_communication("payment", "success", timestamp)
