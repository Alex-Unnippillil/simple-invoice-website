# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Stripe Payment Element

The server uses Stripe's Payment Element to dynamically display Apple Pay, Google Pay, and ACH depending on device and tenant eligibility.

### Running locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set environment variables in a `.env` file:

   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Visit `http://localhost:4242` and test payment methods. Apple Pay and Google Pay buttons appear when the device and browser support them. ACH is shown when the tenant configuration allows `us_bank_account`.

Server-side configuration uses a simple tenant map to check allowed methods by tenant/location before creating PaymentIntents or SetupIntents.
