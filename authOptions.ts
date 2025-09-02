import type { AuthOptions, SessionStrategy } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "./lib/prisma";

const isProd = process.env.NODE_ENV === "production";

// Allow choosing between JWT and database sessions via environment variable
const sessionStrategy: SessionStrategy =
  process.env.SESSION_STRATEGY === "database" ? "database" : "jwt";

export const buildAuthOptions = (adapter?: Adapter): AuthOptions => {
  const options: AuthOptions = {
    session: {
      strategy: sessionStrategy,
    },
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials.password) return null;
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user) return null;
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) return null;
          return { id: user.id.toString(), email: user.email };
        },
      }),
    ],
    cookies: {
      sessionToken: {
        options: {
          secure: isProd,
          httpOnly: true,
          sameSite: "lax",
        },
      },
    },
  };

  if (sessionStrategy === "database" && adapter) {
    options.adapter = adapter;
  }

  return options;
};
