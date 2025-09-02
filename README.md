# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Authentication

The site uses [Auth.js](https://authjs.dev) with the Microsoft Azure AD provider. Tenant, client ID, and client secret are read from environment variables defined in `.env.example`.

After users sign in, Azure AD roles are converted to application roles via the mapping in `lib/roles.js`.

Enterprise organizations can follow `docs/enterprise-setup.md` for full setup instructions.

Visit `/admin/login` to access the admin login page which offers a **Sign in with Microsoft** option.
