import NextAuth from "next-auth";
import { buildAuthOptions } from "@/authOptions";

const handler = NextAuth(buildAuthOptions());

export { handler as GET, handler as POST };
