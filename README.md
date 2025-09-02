# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Setup

Copy the example environment file and provide real values:

```
cp .env.example .env.local
```

## Lease Documents

This demo adds a minimal lease document system. Start the server and open `/leases/<leaseId>` to upload files and view previously uploaded documents. Files are stored in Amazon S3 when `AWS_REGION` and `S3_BUCKET` are configured; otherwise they are kept locally under `uploads/`. Download links use signed URLs that expire after one hour.

### Running

```
npm install
npm start
```

Set `AWS_REGION` and `S3_BUCKET` in `.env.local` to use S3. When these variables are not configured, files are stored locally.
