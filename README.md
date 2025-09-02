# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Environment Variables

Store secrets for local development in `.env.local` and do not commit this file.

1. Add your secret values to `.env.local`:

   ```bash
   DATABASE_URL=postgres://user:pass@localhost:5432/db
   SECRET_KEY=super-secret-key
   ```

2. Configure the same variables in your Vercel project (via the dashboard or `vercel env`).

3. Pull the Vercel configuration into a local `.env` file when developing:

   ```bash
   vercel env pull .env
   ```

At runtime, access the variables via `process.env`.
Use the `NEXT_PUBLIC_` prefix for any values required on the client.
