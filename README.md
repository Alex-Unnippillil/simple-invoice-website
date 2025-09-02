# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Rate limiting

This project uses [Upstash Redis](https://upstash.com) and the `@upstash/ratelimit` package to
track requests per IP, user (via `x-user-id` header), and route. Requests over the limit return a
`429` response with a `Retry-After` header indicating when to retry. Analytics are enabled so you can
inspect burst dashboards in the Upstash console.

### Environment variables

Create a `.env` file with your Upstash credentials:

```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Start the server with `npm start` and view burst analytics in your Upstash dashboard.
