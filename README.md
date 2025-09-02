# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Payment retry communication

The codebase now includes simple helpers for scheduling retry emails/SMS when a payment fails.
A configurable cadence (default `0/3/7` days) can be adjusted per organization via
an in-memory admin interface. When payment succeeds, retries are cancelled and the invoice is
marked complete. Every action taken is stored on the invoice's communication history.
