import type { AuthOptions, SessionStrategy } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import EmailProvider from "next-auth/providers/email";

const isProd = process.env.NODE_ENV === "production";

// Allow choosing between JWT and database sessions via environment variable
const sessionStrategy: SessionStrategy =
  process.env.SESSION_STRATEGY === "database" ? "database" : "jwt";

export const buildAuthOptions = (adapter?: Adapter): AuthOptions => {
  const options: AuthOptions = {
    providers: [],
    session: {
      strategy: sessionStrategy,
    },
    cookies: {
      sessionToken: {
        name: isProd
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
        options: {
          secure: isProd,
          httpOnly: true,
          sameSite: "lax",
          path: "/",
        },
      },
    },
  };

  if (!isProd) {
    options.providers?.push(
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST ?? "localhost",
          port: Number(process.env.EMAIL_SERVER_PORT ?? 1025),
          auth: {
            user: process.env.EMAIL_SERVER_USER ?? "", // MailDev accepts any credentials
            pass: process.env.EMAIL_SERVER_PASSWORD ?? "",
          },
        },
        from: process.env.EMAIL_FROM ?? "no-reply@example.com",
      })
    );
  }

  if (adapter) {
    options.adapter = adapter;
  }

  return options;
};
