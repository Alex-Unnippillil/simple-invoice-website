import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { mapRoles } from "../../../lib/roles";

export default NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.roles) {
        token.roles = mapRoles(profile.roles);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.roles = token.roles || [];
      return session;
    },
  },
});
