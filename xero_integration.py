import os
import json
from typing import Dict

from tenacity import retry, stop_after_attempt, wait_exponential

try:
    from xero_python.accounting import AccountingApi
    from xero_python.accounting.models import Payment, Payments, Invoice, Account
    from xero_python.api_client import ApiClient
    from xero_python.api_client.configuration import Configuration
except ImportError as exc:
    raise ImportError("xero-python SDK is required. Install with `pip install xero-python`." ) from exc

LOCAL_DB = "payments.json"

def load_records() -> Dict[str, Dict[str, str]]:
    """Load stored invoice/payment references."""
    try:
        with open(LOCAL_DB, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except FileNotFoundError:
        return {}


def save_records(records: Dict[str, Dict[str, str]]) -> None:
    """Persist invoice/payment references."""
    with open(LOCAL_DB, "w", encoding="utf-8") as fh:
        json.dump(records, fh, indent=2)


def _get_accounting_api() -> AccountingApi:
    """Configure Xero Accounting API client using an existing OAuth2 token."""
    config = Configuration(oauth2_token={"access_token": os.environ["XERO_TOKEN"], "expires_in": 0})
    api_client = ApiClient(config)
    return AccountingApi(api_client)


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=8))
def create_payment(invoice_id: str, amount: float, date: str, account_id: str) -> str:
    """Create a Xero payment and return the payment ID.

    Retries on temporary failures with exponential backoff.
    """
    accounting_api = _get_accounting_api()
    payment = Payment(
        invoice=Invoice(invoice_id=invoice_id),
        account=Account(account_id=account_id),
        amount=amount,
        date=date,
    )
    response = accounting_api.create_payments(
        xero_tenant_id=os.environ["XERO_TENANT_ID"],
        payments=Payments(payments=[payment]),
    )
    return response.payments[0].payment_id


def update_local_records(invoice_id: str, payment_id: str, amount: float) -> None:
    """Store mapping between invoice and Xero payment."""
    records = load_records()
    records[invoice_id] = {"payment_id": payment_id, "amount": amount}
    save_records(records)


def verify_payment(payment_id: str, amount: float) -> bool:
    """Check that payment exists in Xero and matches the expected amount."""
    accounting_api = _get_accounting_api()
    payment = accounting_api.get_payment(
        xero_tenant_id=os.environ["XERO_TENANT_ID"],
        payment_id=payment_id,
    )
    xero_amount = float(payment.payments[0].amount)
    return abs(xero_amount - amount) < 0.01


def handle_payment_success(invoice_id: str, amount: float, date: str, account_id: str) -> str:
    """High-level workflow executed on successful external payment."""
    payment_id = create_payment(invoice_id, amount, date, account_id)
    update_local_records(invoice_id, payment_id, amount)
    if not verify_payment(payment_id, amount):
        raise RuntimeError("Payment verification failed")
    return payment_id


__all__ = [
    "create_payment",
    "update_local_records",
    "verify_payment",
    "handle_payment_success",
]
