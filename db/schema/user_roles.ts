import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Stores the role for each authenticated user by email
export const userRoles = sqliteTable("user_roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  role: text("role").notNull(),
});

export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;
