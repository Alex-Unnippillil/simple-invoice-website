# simple-invoice-website

Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Utilities

- `lib/format/address.ts` uses [`address-formatter`](https://www.npmjs.com/package/address-formatter) to format address objects for display.
- `components/PhoneField.tsx` integrates [`react-phone-number-input`](https://github.com/catamphetamine/react-phone-number-input) and validates numbers with [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js).
