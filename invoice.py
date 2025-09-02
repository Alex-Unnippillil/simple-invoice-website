from datetime import datetime

class Invoice:
    """Represents a simple invoice and its communication history."""

    def __init__(self, invoice_id, organization_id, amount_due):
        self.invoice_id = invoice_id
        self.organization_id = organization_id
        self.amount_due = amount_due
        self.paid = False
        # list of dictionaries recording communications related to this invoice
        self.communication_history = []
        # scheduled retry datetimes for future communications
        self.scheduled_retries = []

    def record_communication(self, channel, status, timestamp=None, info=None):
        """Track a communication event for the invoice.

        Parameters
        ----------
        channel: str
            e.g. "email" or "sms" or "schedule".
        status: str
            description such as "sent", "queued" or "success".
        timestamp: datetime, optional
            when the event occurred. Defaults to utcnow.
        info: str, optional
            additional details to store with the event.
        """
        timestamp = timestamp or datetime.utcnow()
        event = {"time": timestamp, "channel": channel, "status": status}
        if info:
            event["info"] = info
        self.communication_history.append(event)
