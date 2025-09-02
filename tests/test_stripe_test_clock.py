import os
import time

import pytest
import stripe

from stripe_test_clock import create_test_clock, advance_test_clock

stripe.api_key = os.environ.get("STRIPE_API_KEY", "")


pytestmark = pytest.mark.skipif(
    not stripe.api_key, reason="STRIPE_API_KEY not set"
)


def _create_failing_customer(clock_id: str):
    customer = stripe.Customer.create(test_clock=clock_id)
    payment_method = stripe.PaymentMethod.create(
        type="card",
        card={
            "number": "4000000000000002",  # always fails
            "exp_month": 12,
            "exp_year": 2030,
            "cvc": "123",
        },
    )
    stripe.PaymentMethod.attach(payment_method.id, customer=customer.id)
    stripe.Customer.modify(
        customer.id,
        invoice_settings={"default_payment_method": payment_method.id},
    )
    return customer


def test_invoice_due_date_and_dunning():
    start = int(time.time())
    clock = create_test_clock(start)

    # Create manual invoice to test due date handling
    manual_customer = stripe.Customer.create(test_clock=clock.id)
    stripe.InvoiceItem.create(customer=manual_customer.id, amount=1000, currency="usd")
    invoice = stripe.Invoice.create(
        customer=manual_customer.id,
        collection_method="send_invoice",
        days_until_due=1,
    )
    invoice = stripe.Invoice.finalize_invoice(invoice.id)
    assert invoice.due_date is not None

    # Advance past due date
    advance_test_clock(clock.id, invoice.due_date + 24 * 3600)
    invoice = stripe.Invoice.retrieve(invoice.id)
    clock_state = stripe.test_helpers.TestClock.retrieve(clock.id)
    assert invoice.due_date < clock_state.frozen_time

    # Create subscription with failing payment to test dunning
    customer = _create_failing_customer(clock.id)
    subscription = stripe.Subscription.create(
        customer=customer.id,
        items=[
            {
                "price_data": {
                    "currency": "usd",
                    "unit_amount": 1000,
                    "recurring": {"interval": "month"},
                    "product_data": {"name": "Test"},
                }
            }
        ],
    )
    invoice = stripe.Invoice.retrieve(subscription.latest_invoice)
    stripe.Invoice.finalize_invoice(invoice.id)
    invoice = stripe.Invoice.retrieve(invoice.id)
    first_attempt = invoice.next_payment_attempt
    attempt_count = invoice.attempt_count

    advance_test_clock(clock.id, first_attempt)
    invoice = stripe.Invoice.retrieve(invoice.id)
    assert invoice.attempt_count == attempt_count + 1
