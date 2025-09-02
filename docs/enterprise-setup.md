# Enterprise Setup

These steps help large organizations connect their Azure Active Directory tenant to this application.

1. Register an application in Azure AD and record its **Client ID**, **Client Secret**, and **Tenant ID**.
2. Under authentication, add the redirect URL:
   `https://<your-domain>/api/auth/callback/azure-ad`.
3. In your deployment environment, set the variables from `.env.example` with your Azure AD credentials.
4. Assign users to application roles in Azure AD. The `lib/roles.js` file maps Azure roles such as `Admin` and `User` to application roles.
5. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
6. Users visiting `/admin/login` can sign in with their Microsoft account and receive roles based on the mapping.
