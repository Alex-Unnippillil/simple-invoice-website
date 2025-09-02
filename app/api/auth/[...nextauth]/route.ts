import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { buildAuthOptions } from "../../../../authOptions";

const prisma = new PrismaClient();

const handler = NextAuth(buildAuthOptions(PrismaAdapter(prisma)));

export { handler as GET, handler as POST };
