# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Stripe payout reconciliation

`stripe_reconciliation.py` is a small utility that helps import Stripe payout
reports and reconcile them with local invoice/payment records.

### Usage

```
python stripe_reconciliation.py <payouts.csv> <payments.csv> <output.csv>
```

The script will:
1. Load the Stripe payout CSV and the invoice/payment CSV.
2. Aggregate transactions by payout and flag mismatches.
3. Provide an interactive view to mark discrepancies as resolved.
4. Export a reconciliation CSV mirroring the Stripe payout report.
