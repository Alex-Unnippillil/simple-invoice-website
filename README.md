# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Invoice generator

`invoice_generator.py` allows you to select multiple tenants and automatically create invoices for the next billing period.

### Usage

```bash
python invoice_generator.py --tenants 1,2
```

The command above reads `tenants.json`, creates the next month's invoice for tenants 1 and 2 with proper invoice numbers and date ranges, stores the invoices in `invoices.json`, and updates each tenant's latest invoice information.
