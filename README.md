# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Feature Flags

The application uses environment-driven feature flags to safely roll out risky capabilities.

- `ENABLE_AUTOPAY` – allows automatic payment of invoices. Off by default.
- `ENABLE_ACH_PAYMENTS` – enables ACH payment processing. Off by default.
- `ENABLE_NEW_SEARCH` – switches to the new invoice search implementation. Off by default.

Set a flag to `true` in the environment to enable the related feature.
