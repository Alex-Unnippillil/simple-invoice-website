# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Accounting Exports

An admin dashboard is available at `/admin` when running the server. From there CSV files matching QuickBooks or Xero import schemas can be downloaded for manual upload into those systems.

Future work will push invoice data directly to the QuickBooks and Xero APIs once credentials and synchronization workflows are finalized.

## Development

Install dependencies and build the project:

```bash
npm install
npm run build
npm start
```
