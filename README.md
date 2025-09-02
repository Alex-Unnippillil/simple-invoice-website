# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Testing

End-to-end tests are written with [Playwright](https://playwright.dev/).

### Running locally

Install dependencies and browsers:

```bash
npm install
npx playwright install chromium
```

Run tests (requires a running instance of the application):

```bash
APP_URL="http://localhost:3000" \
TEST_USER_EMAIL="user@example.com" \
TEST_USER_PASSWORD="password" \
npm test
```

The tests cover:
- logging in
- viewing an invoice
- completing a Stripe test payment using card `4242 4242 4242 4242`
- viewing and printing the receipt

### Continuous Integration

GitHub Actions is configured to run the Playwright test suite on every push and pull request.
Environment variables `APP_URL`, `TEST_USER_EMAIL`, and `TEST_USER_PASSWORD`
must be provided via repository secrets for the workflow to execute the tests.
