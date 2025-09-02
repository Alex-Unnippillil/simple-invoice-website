#!/usr/bin/env bash
set -euo pipefail

ENDPOINT=${ENDPOINT:-http://localhost:9000}
BUCKET=${BUCKET:-pdfs}
ACCESS_KEY=${MINIO_ROOT_USER:-minioadmin}
SECRET_KEY=${MINIO_ROOT_PASSWORD:-minioadmin}

export AWS_ACCESS_KEY_ID="$ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$SECRET_KEY"
export AWS_DEFAULT_REGION=us-east-1

# Create bucket if it does not exist
aws --endpoint-url "$ENDPOINT" s3api create-bucket --bucket "$BUCKET" 2>/dev/null || true

# Upload a sample file to verify
aws --endpoint-url "$ENDPOINT" s3 cp README.md "s3://$BUCKET/readme.txt"

# List bucket contents
aws --endpoint-url "$ENDPOINT" s3 ls "s3://$BUCKET"
