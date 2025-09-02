# Entra Setup

This project uses Microsoft Entra ID for authentication via NextAuth.

## Application registration

1. Sign in to the Azure portal.
2. Navigate to **Microsoft Entra ID** > **App registrations** > **New registration**.
3. Provide a name, choose supported account types, and set a redirect URI for your deployment.
4. After the app is created, record the following values from the overview page:
   - **Tenant ID** ("Directory (tenant) ID")
   - **Client ID** ("Application (client) ID")
5. Create a client secret under **Certificates & secrets** and copy the value.

## Environment variables

Add the values to your environment configuration:

```
AZURE_AD_TENANT_ID=<tenant-id>
AZURE_AD_CLIENT_ID=<client-id>
AZURE_AD_CLIENT_SECRET=<client-secret>
AZURE_AD_ADMIN_GROUP_ID=<group-id-for-admin>
AZURE_AD_USER_GROUP_ID=<group-id-for-user>
```

For role mapping based on group claims, ensure your application manifest sets `groupMembershipClaims` to `SecurityGroup` so group IDs are included in the ID token.
