import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import prisma from "../../../lib/prisma"

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const allowed = (process.env.ALLOWED_ORG_DOMAINS || "").split(",").map(d => d.trim()).filter(Boolean)
      const email = profile.email
      const domain = email.split("@")[1]
      if (allowed.length && !allowed.includes(domain)) {
        return false
      }
      const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim()).filter(Boolean)
      await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: profile.name,
          image: profile.picture,
          role: adminEmails.includes(email) ? "admin" : "user",
        },
      })
      return true
    },
    async session({ session }) {
      const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })
      if (dbUser) {
        session.user.role = dbUser.role
      }
      return session
    },
  },
})
