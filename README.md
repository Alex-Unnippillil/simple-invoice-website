# simple-invoice-website
basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Stripe and QuickBooks Integration

The project now includes an example webhook handler (`webhooks/stripe_qbo_payment.py`) that
creates a QuickBooks Online **ReceivePayment** when a Stripe payment succeeds.
It updates local invoice and payment records with the QBO identifiers, provides
a helper to confirm reconciliation status, and retries failed API calls with
exponential backoff while logging the errors.
