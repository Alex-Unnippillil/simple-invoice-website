# simple-invoice-website
basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Lease Summary PDF

Run `npm start` to launch the server. Visit `http://localhost:3000` to view leases and download a lease summary PDF.

The API endpoint `GET /api/leases/:id/pdf` renders a PDF containing basic lease, tenant, and property information. Generated files are saved in the `documents/` folder for later reference.
