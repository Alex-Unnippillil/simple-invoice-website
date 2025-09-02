# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Lease Documents

This demo adds a minimal lease document system. Start the server and open `/leases/<leaseId>` to upload files and view previously uploaded documents. Files are stored in Amazon S3 when `AWS_REGION` and `S3_BUCKET` are configured; otherwise they are kept locally under `uploads/`. Download links use signed URLs that expire after one hour.

### Running

```
npm install
npm start
```

Set environment variables for AWS to use S3:

```
export AWS_REGION=us-east-1
export S3_BUCKET=your-bucket
```

### Default Credentials (Development)

The seed script creates default accounts for convenience:

- Admin: `admin@example.com` with password `admin123`
- Tenant: `tenant@example.com`

These credentials are intended for local development only.
