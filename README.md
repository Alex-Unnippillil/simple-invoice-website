# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Printing

Open `public/index.html` in a browser and use the **Print** button. The included
`print.css` stylesheet ensures a paper-friendly layout for both landlord and
tenant copies.

## Generating PDFs

The `generateInvoicePDF` function in `lib/pdf/invoice.ts` creates an invoice PDF
that includes a logo, landlord contact information, and a list of line items.
