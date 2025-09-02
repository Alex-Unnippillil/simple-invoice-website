# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Development

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your Stripe keys.

3. Start the development server:

```bash
npm run dev
```

Visit `/pay` to pay rent using Stripe's Payment Element.
