# simple-invoice-website
basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Xero Integration

Set the following environment variables before running:

- `XERO_TOKEN`: OAuth2 access token.
- `XERO_TENANT_ID`: Tenant identifier.
- `XERO_API_BASE`: Optional override for API base.

Run the app:

```
pip install -r requirements.txt
python app.py
```

The app will sync tenants as Xero contacts and create invoices in Xero, storing the invoice URLs for quick access.
