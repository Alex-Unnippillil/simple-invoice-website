# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Lease packet workflow

The `lease_packet` module demonstrates how to handle a landlord countersignature flow and generate a final signed packet for download:

1. **Countersignature** – `request_landlord_countersign` can prompt the landlord in-app or route the request through a third-party provider.
2. **Merge documents** – `merge_signed_documents` combines the lease summary and signed attachments into a single PDF.
3. **Store final packet** – `store_final_packet` saves the merged PDF into a document library directory.
4. **Download link** – `download_link` returns the path to the stored packet so it can be offered as a download in the lease interface.

Run the tests to see the workflow in action:

```bash
pytest -q
```
