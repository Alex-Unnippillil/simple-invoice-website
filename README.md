# simple-invoice-website
basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Xero Payment Integration

This repository includes `xero_integration.py` to create payments in Xero when a local payment succeeds. The workflow:

1. Creates a Xero payment linked to a provided invoice.
2. Stores the Xero payment reference in `payments.json`.
3. Verifies the payment amount through the Xero API.
4. Retries temporary failures with exponential backoff.

### Usage

Set the following environment variables before running:

- `XERO_TOKEN` – OAuth2 access token with accounting scope
- `XERO_TENANT_ID` – Xero tenant identifier

Call `handle_payment_success(invoice_id, amount, date, account_id)` after a payment succeeds locally. Dependencies are listed in `requirements.txt`.
