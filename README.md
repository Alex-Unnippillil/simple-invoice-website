# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set your [Resend](https://resend.com/) API key:
   ```bash
   RESEND_API_KEY=your_resend_api_key
   ```
3. Start the local server:
   ```bash
   npm start
   ```
4. Test the preview email endpoint:
   ```bash
   curl http://localhost:3000/api/test-email
   ```
   With a valid API key, this sends a test email using [React Email](https://react.email/) components.
