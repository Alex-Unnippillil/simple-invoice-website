# simple-invoice-website
basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Invoice numbers

The utility in `lib/invoice.ts` exports `generateInvoiceNumber`, which creates
unique invoice numbers like `INV-2024-0001` inside a database transaction to
avoid collisions.
