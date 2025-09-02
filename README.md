# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Payment recovery utilities

The project now includes simple tooling to track failed payment attempts and analyse
recovery performance:

- `payment_processor.py` records each payment attempt, capturing the `decline_code`,
  retry number and timestamp.
- `dashboard.py` reports the recovery rate by decline reason using the stored data.
- `dunning_strategy.py` offers naive dunning recommendations based on observed
  recovery rates.

Tests demonstrate the tracking and reporting workflow.
