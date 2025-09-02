# simple-invoice-website
basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Development

```bash
npm install
node index.js
```

### Routes

* `GET /tenant/pay/confirm?status=success|cancel` – redirect after payment processing.
* `GET /tenant/pay/success` – displays successful payment message.
* `GET /tenant/pay/cancel` – displays cancellation message.
