# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Antivirus scanning

Uploads to S3 can be scanned for viruses using an AWS Lambda function running ClamAV. New objects trigger the Lambda via S3 event notifications. The handler marks objects as `PENDING` until the scan completes and updates metadata to `CLEAN` or `INFECTED`.

Infected files are removed from the source bucket and optionally copied to a quarantine bucket. A message is published to the `ADMIN_SNS_TOPIC_ARN` SNS topic to alert administrators.

Environment variables:

- `ADMIN_SNS_TOPIC_ARN` – SNS topic for infection alerts.
- `QUARANTINE_BUCKET` – Bucket where infected files are copied; if not set, infected files are deleted.

The Lambda stores scan results in the `av-status` metadata on each object.
