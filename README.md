# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Radar Rule Management

This project now includes a minimal interface to manage Stripe Radar rules and tenant email allow/deny lists.

### Features

- Create or update Radar rules for blocking specific countries or limiting payment velocity.
- Add tenant emails to allow/deny lists stored in Stripe Radar value lists.
- Changes are saved via Stripe's API and can be viewed in the Stripe Dashboard.
- All rule and list changes are appended to `logs/audit.log` for auditing.

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set your Stripe secret key in the environment:
   ```bash
   export STRIPE_SECRET_KEY=sk_test_...
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Open `http://localhost:3000` in the browser to access the interface.

> **Note:** The included test script is a placeholder; no automated tests are provided.
