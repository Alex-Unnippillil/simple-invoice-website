# simple-invoice-website
Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## File Retention

This project now includes a simple file retention mechanism:

- **Configurable retention** per organisation via `retention-policies.json`.
- **Legal hold overrides** that prevent deletion of specific files.
- **Scheduled deletion job** that removes files in `uploads/` older than the configured policy.
- **Notifications** printed to the console before a file is permanently deleted.
- **Audit logging** to `deletion.log` for every file removed.

Run the retention worker manually:

```bash
node -e "require('./index').checkForDeletions();"
```
