# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Lease Documents

This demo adds a minimal lease document system. Start the server and open `/leases/<leaseId>` to upload files and view previously uploaded documents. Files are stored in Amazon S3 when `AWS_REGION` and `S3_BUCKET` are configured; otherwise they are kept locally under `uploads/`. Download links use signed URLs that expire after one hour.

### Running

```
npm install

# start development server with automatic reload
npm run dev

# compile TypeScript utilities
npm run build

# run the server
npm start

# run tests
npm test
```

Set environment variables for AWS to use S3:

```
export AWS_REGION=us-east-1
export S3_BUCKET=your-bucket
```
