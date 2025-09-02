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

### Local MinIO

A `docker-compose.yml` file is provided to run a local [MinIO](https://min.io/) server for storing PDFs.

Start the service:

```
docker compose up -d minio
```

Create the default `pdfs` bucket and upload a sample file using the provided script (requires the AWS CLI):

```
pip install awscli
./scripts/create_pdf_bucket.sh
```

The script verifies the bucket exists and lists uploaded files. The MinIO web console is available at `http://localhost:9001`.
