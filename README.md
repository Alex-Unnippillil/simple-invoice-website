# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Stripe Customer Portal

The included Express server configures the [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal) so tenants can update saved cards or bank accounts and view past invoices.

### Environment variables

- `STRIPE_SECRET_KEY` – live mode secret key used in production
- `STRIPE_TEST_SECRET_KEY` – test mode secret key for development/preview deployments
- `RETURN_URL` – URL users are sent to when leaving the portal
- `VERCEL_ENV` – set to `production` in production; any other value uses test mode

### Running

Install dependencies and start the server:

```bash
npm install
npm start
```

Request a portal session link for a tenant:

```bash
curl http://localhost:3000/tenants/demo/portal
```

The response contains a `url` that can be used on the account page to direct the tenant to their billing portal with invoice history and payment method management enabled.
