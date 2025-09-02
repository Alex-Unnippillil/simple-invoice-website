# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Push notifications

Generate VAPID keys:

```bash
npm run generate:vapid
```

Build client push helper:

```bash
npm run build
```

Start the development server:

```bash
node server.js
```

Visit `/admin.html` to subscribe and send a test push notification.
