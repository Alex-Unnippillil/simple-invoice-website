import os
from dataclasses import dataclass
from typing import Callable, Optional

import stripe

stripe.api_key = os.environ.get("STRIPE_API_KEY", "")

@dataclass
class Lease:
    """Represents a lease in the application."""
    id: int
    monthly_rent: int  # dollars
    stripe_customer_id: str
    stripe_subscription_id: Optional[str] = None
    status: str = "pending"


def create_subscription_for_lease(lease: Lease):
    """Create a Stripe subscription for the given lease.

    Parameters
    ----------
    lease: Lease
        Lease to attach subscription to. Assumes `stripe_customer_id` is set.

    Returns
    -------
    stripe.Subscription
        The created subscription object.
    """
    subscription = stripe.Subscription.create(
        customer=lease.stripe_customer_id,
        items=[{
            "price_data": {
                "currency": "usd",
                "unit_amount": lease.monthly_rent * 100,
                "recurring": {"interval": "month"},
                "product_data": {"name": f"Lease {lease.id} Rent"},
            }
        }],
    )
    lease.stripe_subscription_id = subscription.id
    return subscription


def reconcile_invoices(lease: Lease):
    """Retrieve Stripe invoices for a lease subscription.

    Returns a list of invoices for further reconciliation with the app's
    invoice records.
    """
    if not lease.stripe_subscription_id:
        raise ValueError("Lease has no subscription ID")
    return stripe.Invoice.list(subscription=lease.stripe_subscription_id)


def refresh_subscription_status(lease: Lease):
    """Refresh the subscription status from Stripe and update the lease."""
    if not lease.stripe_subscription_id:
        raise ValueError("Lease has no subscription ID")
    subscription = stripe.Subscription.retrieve(lease.stripe_subscription_id)
    lease.status = subscription.status
    return subscription.status


def handle_billing_event(event: stripe.Event, update_invoice: Callable):
    """React to Stripe billing events to keep app invoices up-to-date.

    Parameters
    ----------
    event: stripe.Event
        The event received from Stripe's webhook.
    update_invoice: Callable
        Callback that updates an invoice in the application. Should accept the
        stripe invoice object and an optional `cancelled` flag.
    """
    data = event.data.object

    if event.type in {"invoice.paid", "invoice.payment_failed"}:
        update_invoice(data)
    elif event.type == "customer.subscription.deleted":
        update_invoice(data, cancelled=True)
