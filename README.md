# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Development

- `app.py` provides a small Flask server with an SQLite database.
- Webhook endpoints `/webhook/resend` and `/webhook/twilio` flag email addresses or phone numbers as risky.
- The contact list UI shows a red "risky" badge and warns before sending messages to flagged contacts.
