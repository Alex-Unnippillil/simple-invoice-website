# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Sentry Error Tracking

Sentry is configured through the `SENTRY_DSN` environment variable. Copy `.env.local.example` to `.env.local` and provide your DSN:

```
cp .env.local.example .env.local
# edit .env.local and set SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN
```

Run the development server and trigger a test error by visiting the `/api/test-error` route or by clicking the **Trigger Client Error** button on the home page.

```
npm run dev
# in another terminal
curl http://localhost:3000/api/test-error
```

The error should appear in your Sentry dashboard.
