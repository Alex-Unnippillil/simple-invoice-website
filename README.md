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

## Feature Flags

Feature flags can be supplied by either [Unleash](https://www.getunleash.io/) or [Vercel Edge Config](https://vercel.com/docs/edge-network/edge-config).
Set the relevant environment variables for the provider you use:

### Unleash

```
export UNLEASH_API_URL=https://unleash.example.com/api
export UNLEASH_API_TOKEN=your-token
```

### Edge Config

```
export EDGE_CONFIG_URL=https://edge-config.vercel.com/<id>/config
```

Flags are fetched on each request by the middleware and exposed to the application via the `x-feature-flags` request header.
