import type { AuthOptions, SessionStrategy } from "next-auth";
import type { Adapter } from "next-auth/adapters";

const isProd = process.env.NODE_ENV === "production";

// Allow choosing between JWT and database sessions via environment variable
const sessionStrategy: SessionStrategy =
  process.env.SESSION_STRATEGY === "database" ? "database" : "jwt";

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
  };

  if (sessionStrategy === "database" && adapter) {
    options.adapter = adapter;
  }

  return options;
};
