import type { AuthOptions, SessionStrategy } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { getUserRoleByEmail } from "./db/userRoles";

const isProd = process.env.NODE_ENV === "production";

// Allow choosing between JWT and database sessions via environment variable
const sessionStrategy: SessionStrategy =
  process.env.SESSION_STRATEGY === "database" ? "database" : "jwt";

export const buildAuthOptions = (adapter?: Adapter): AuthOptions => {
  const options: AuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        authorization: {
          params: {
            // Restrict sign-ins to the configured Google Workspace domain
            hd: process.env.GOOGLE_ALLOWED_DOMAIN,
          },
        },
      }),
    ],
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
    callbacks: {
      // Reject sign-ins for emails outside the allowed domain
      async signIn({ profile }) {
        const domain = process.env.GOOGLE_ALLOWED_DOMAIN;
        const email = profile?.email ?? "";
        return domain ? email.endsWith(`@${domain}`) : true;
      },
      // Attach the user's role from the database to the session
      async session({ session }) {
        const email = session.user?.email;
        if (email) {
          const role = await getUserRoleByEmail(email);
          (session.user as any).role = role;
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
