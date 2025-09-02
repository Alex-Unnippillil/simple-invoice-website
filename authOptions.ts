import type { AuthOptions, SessionStrategy } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import AzureADProvider from "next-auth/providers/azure-ad";

const isProd = process.env.NODE_ENV === "production";

// Allow choosing between JWT and database sessions via environment variable
const sessionStrategy: SessionStrategy =
  process.env.SESSION_STRATEGY === "database" ? "database" : "jwt";

const groupRoleMap: Record<string, string> = {
  [process.env.AZURE_AD_ADMIN_GROUP_ID ?? ""]: "admin",
  [process.env.AZURE_AD_USER_GROUP_ID ?? ""]: "user",
};

const mapGroupsToRoles = (groups: string[]): string[] => {
  const roles = groups.map((g) => groupRoleMap[g]).filter(Boolean) as string[];
  return Array.from(new Set(roles));
};

export const buildAuthOptions = (adapter?: Adapter): AuthOptions => {
  const options: AuthOptions = {
    session: {
      strategy: sessionStrategy,
    },
    cookies: {
      sessionToken: {
        options: {
          secure: isProd,
          httpOnly: true,
          sameSite: "lax",
        },
      },
    },
    providers: [
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID ?? "",
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? "",
        tenantId: process.env.AZURE_AD_TENANT_ID,
      }),
    ],
    callbacks: {
      jwt: async ({ token, profile }) => {
        const groups = (profile as any)?.groups as string[] | undefined;
        if (groups) {
          token.roles = mapGroupsToRoles(groups);
        }
        return token;
      },
      session: async ({ session, token }) => {
        if (token.roles) {
          (session.user as any).roles = token.roles;
        }
        return session;
      },
    },
  };

  if (sessionStrategy === "database" && adapter) {
    options.adapter = adapter;
  }

  return options;
};
