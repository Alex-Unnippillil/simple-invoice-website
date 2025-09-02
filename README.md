# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Authentication

This project uses [Auth.js](https://authjs.dev/) with the email provider and an SMTP service
such as [Resend](https://resend.com/) to send one‑time login links. Tenants request a link
from `/auth/signin` and receive an email containing a magic link. Clicking the link verifies
the request and creates a session.

### Environment Variables

Create a `.env` file using `.env.example` as a template and provide the SMTP credentials for your provider.

```
AUTH_SECRET=your-auth-secret
EMAIL_FROM=Simple Invoice <noreply@example.com>
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=your-resend-api-key
```

### Rate Limiting

Requests for magic links are rate limited to one per minute per email address to reduce abuse.
