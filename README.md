# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Lease document archives

This example includes a small Flask application that can collect all documents
for a lease, stream them into a ZIP archive with a `manifest.json` file and
optionally persist the archive for audit purposes. A temporary download link is
produced via signed tokens and a minimal UI button is available at
`/leases/<lease_id>/documents` to trigger the download.

### Running locally

```bash
pip install -r requirements.txt
python app.py
```

Visit `http://localhost:5000/leases/lease1/documents` and click **Download ZIP**
to generate a temporary link and retrieve the archive.
