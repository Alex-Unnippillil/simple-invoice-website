# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Lease Documents

This demo adds a minimal lease document system. Start the server and open `/leases/<leaseId>` to upload files and view previously uploaded documents. Files are stored in Amazon S3 when `AWS_REGION` and `S3_BUCKET` are configured; otherwise they are kept locally under `uploads/`. Download links use signed URLs that expire after one hour.

## Development Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/your-org/simple-invoice-website.git
   cd simple-invoice-website
   npm ci
   ```
2. Copy environment variables template:
   ```bash
   cp .env.example .env
   ```
3. Start services:
   ```bash
   docker compose up -d
   ```
4. Apply database migrations and seed data:
   ```bash
   npx prisma migrate deploy
   node prisma/seed.js
   ```
5. Forward Stripe webhooks in a separate terminal:
   ```bash
   stripe listen --forward-to http://localhost:3000/webhook
   ```
6. Launch the development server:
   ```bash
   npm start
   ```
7. Have another developer follow these steps to validate the flow.

Set environment variables for AWS to use S3:

```
export AWS_REGION=us-east-1
export S3_BUCKET=your-bucket
```
