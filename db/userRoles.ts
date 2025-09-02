import { eq } from "drizzle-orm";
import { db } from "./client";
import { userRoles } from "./schema/user_roles";

// Fetch the application role for a user by their email address
export async function getUserRoleByEmail(email: string): Promise<string | null> {
  const result = await db
    .select({ role: userRoles.role })
    .from(userRoles)
    .where(eq(userRoles.email, email));
  return result[0]?.role ?? null;
}
