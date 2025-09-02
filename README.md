# simple-invoice-website
basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Development

Install dependencies:

```bash
npm install
```

Run the server:

```bash
npm start
```

The server listens for webhook or API calls to detect expired or declined envelopes, surfaces errors in the UI with options to resend or reinvite signers, records audit logs, and offers an admin endpoint to regenerate signing links.
