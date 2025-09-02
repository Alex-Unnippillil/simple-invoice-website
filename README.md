# simple-invoice-website
basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Development

The project includes a small Express server instrumented with [Sentry](https://sentry.io/) tracing. Incoming requests log any `traceparent` header and Sentry events are associated with the same trace.

Run the server with:

```bash
SENTRY_DSN=<your dsn> npm start
```

Trigger an example error (which will create a Sentry event linked to the trace) by requesting `GET /error`.

