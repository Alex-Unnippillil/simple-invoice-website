# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

The app is built with Next.js and integrates [`next-intl`](https://next-intl.dev) for internationalization. All routes are prefixed with a locale (for example `/en` or `/es`) and UI strings are stored in translation files. A locale switcher component lets users toggle between languages while staying on the current page.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```
