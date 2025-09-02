import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

// Example in-memory user store. In a real application this should query the database.
const users = [
  {
    id: "1",
    email: "demo@example.com",
    // bcrypt hash for the string "password"
    passwordHash: "$2b$10$CwTycUXWue0Thq9StjUM0uJ8b.C/UG6u.ZYf.Q3u8b6hqhqJv/1.W"
  }
];

export default NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = users.find((u) => u.email === credentials.email);
        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) {
          return null;
        }

        // Returning a user object creates a session
        return { id: user.id, email: user.email };
      }
    })
  ],
  session: {
    strategy: "jwt"
  }
});
