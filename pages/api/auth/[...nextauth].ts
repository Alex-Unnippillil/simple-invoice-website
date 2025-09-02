import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import nodemailer from 'nodemailer';

const requests = new Map<string, number>();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      maxAge: 10 * 60, // 10 minutes
      async sendVerificationRequest({ identifier, url }) {
        const email = identifier.toLowerCase();
        const now = Date.now();
        const last = requests.get(email) || 0;
        if (now - last < 60 * 1000) {
          throw new Error('Too many requests');
        }
        requests.set(email, now);
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          throw new Error('Invalid email');
        }
        const { host } = new URL(url);
        await transporter.sendMail({
          to: email,
          from: process.env.EMAIL_FROM,
          subject: `Sign in to ${host}`,
          text: `Sign in to ${host}\n${url}\n\n`,
        });
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);
