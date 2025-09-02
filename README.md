# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Sync Features

- Nightly job pushes pending invoices and payments to remote accounting systems.
- Conflicts such as remote deletions are logged.
- `/sync-issues` dashboard lists conflicts and provides manual resolve and retry options.

Start the server:

```
npm start
```

Visit `http://localhost:3000/sync-issues` to view and manage sync conflicts.
