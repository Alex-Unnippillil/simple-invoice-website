# Invoice Migration to Leases and Units

This migration maps existing `invoices` records to the new `leases` and `units` tables. It is safe to run multiple times.

## Running the Migration

```bash
psql "$DATABASE_URL" -f migrations/20230902_map_invoices_to_leases_units.sql
```

## Rollback

1. Remove invoice references:
   ```sql
   UPDATE invoices SET lease_id = NULL, unit_id = NULL;
   ```
2. Delete leases and units with no references:
   ```sql
   DELETE FROM leases  l WHERE NOT EXISTS (SELECT 1 FROM invoices i WHERE i.lease_id = l.id);
   DELETE FROM units   u WHERE NOT EXISTS (SELECT 1 FROM leases  l WHERE l.unit_id = u.id);
   ```

## Re-running
The script uses `NOT EXISTS` checks and updates only when values differ, allowing it to be executed multiple times without side effects.

## Staging Verification

After running the migration in staging:

1. Ensure all invoices have references:
   ```sql
   SELECT COUNT(*) FROM invoices WHERE lease_id IS NULL OR unit_id IS NULL;
   ```
2. Check for duplicate leases/units:
   ```sql
   SELECT tenant_id, unit_id, COUNT(*) FROM leases GROUP BY 1,2 HAVING COUNT(*) > 1;
   SELECT property_id, number, COUNT(*) FROM units GROUP BY 1,2 HAVING COUNT(*) > 1;
   ```

## Deployment Execution
Include the following step in the deployment process:

```bash
psql "$DATABASE_URL" -f migrations/20230902_map_invoices_to_leases_units.sql
```

