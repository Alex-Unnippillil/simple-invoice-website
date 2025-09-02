-- Migration: Map old invoice records to new leases and units
-- This script is idempotent and can be run multiple times safely.
-- It inserts missing units and leases based on existing invoice data
-- and updates invoices to reference the newly created records.

BEGIN;

-- Insert units derived from invoice property/unit numbers
INSERT INTO units(id, property_id, number)
SELECT DISTINCT
       md5(CAST(property_id AS text) || '-' || unit_number) AS id,
       property_id,
       unit_number
FROM invoices i
WHERE NOT EXISTS (
    SELECT 1
    FROM units u
    WHERE u.property_id = i.property_id AND u.number = i.unit_number
);

-- Insert leases linking tenants to units
INSERT INTO leases(id, tenant_id, unit_id)
SELECT DISTINCT
       md5(CAST(i.tenant_id AS text) || '-' || u.id) AS id,
       i.tenant_id,
       u.id AS unit_id
FROM invoices i
JOIN units u ON u.property_id = i.property_id AND u.number = i.unit_number
WHERE NOT EXISTS (
    SELECT 1
    FROM leases l
    WHERE l.tenant_id = i.tenant_id AND l.unit_id = u.id
);

-- Update invoices with lease and unit references
UPDATE invoices i
SET lease_id = l.id,
    unit_id = u.id
FROM leases l
JOIN units u ON l.unit_id = u.id
WHERE i.tenant_id = l.tenant_id
  AND i.property_id = u.property_id
  AND i.unit_number = u.number
  AND (i.lease_id IS DISTINCT FROM l.id OR i.unit_id IS DISTINCT FROM u.id);

COMMIT;
