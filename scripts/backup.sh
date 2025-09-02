#!/usr/bin/env bash
# Sync invoice PDFs from Azure Blob storage to S3/R2 and back up the database.
# Requires az cli, aws cli, and pg_dump (optional).

set -euo pipefail

# Azure Blob settings
: "${AZURE_CONTAINER:?Set AZURE_CONTAINER to the source blob container}"
: "${AZURE_STORAGE_ACCOUNT:?Set AZURE_STORAGE_ACCOUNT for the blob account}"
# authentication via AZURE_STORAGE_KEY or AZURE_STORAGE_SAS_TOKEN

# S3/R2 settings
: "${S3_BUCKET:?Set S3_BUCKET to the destination bucket}"
# optional endpoint for R2 or other S3-compatible storage
S3_ENDPOINT="${S3_ENDPOINT:-}"

# Postgres settings
DATABASE_URL="${DATABASE_URL:-}"
RDS_DB_INSTANCE="${RDS_DB_INSTANCE:-}"

WORKDIR="$(mktemp -d)"
cleanup() { rm -rf "$WORKDIR"; }
trap cleanup EXIT

# 1. Copy PDFs from Azure Blob to local temp directory
az storage blob download-batch \
  --source "$AZURE_CONTAINER" \
  --destination "$WORKDIR" \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  ${AZURE_STORAGE_SAS_TOKEN:+--sas-token "$AZURE_STORAGE_SAS_TOKEN"} \
  ${AZURE_STORAGE_KEY:+--account-key "$AZURE_STORAGE_KEY"}

# 2. Sync PDFs to S3/R2
aws s3 sync "$WORKDIR" "s3://$S3_BUCKET/pdfs" \
  ${S3_ENDPOINT:+--endpoint-url "$S3_ENDPOINT"}

# 3. Database snapshot
if [[ -n "$DATABASE_URL" && $(command -v pg_dump) ]]; then
  BACKUP_FILE="db-$(date +%Y%m%d%H%M%S).sql"
  pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
  aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/db/" \
    ${S3_ENDPOINT:+--endpoint-url "$S3_ENDPOINT"}
elif [[ -n "$RDS_DB_INSTANCE" ]]; then
  # Example for AWS RDS managed snapshot
  aws rds create-db-snapshot \
    --db-instance-identifier "$RDS_DB_INSTANCE" \
    --db-snapshot-identifier "snapshot-$(date +%Y%m%d%H%M%S)"
else
  echo "No database backup configuration provided" >&2
fi
