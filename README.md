# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Development

Install dependencies and generate the Prisma client:

```
npm install
npx prisma generate
```

Start the development server:

```
npm run dev
```

## Tenant profile API

`POST /tenant/profile` updates the tenant's address, phone number and currency.
The request body accepts `address`, `phone` and `currency` fields.
