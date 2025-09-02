import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, InferModel } from "drizzle-orm";

// Audit log captures who did what and when against which record
export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tenantId: text("tenant_id").notNull(),
  userId: text("user_id").notNull(),
  action: text("action").notNull(),
  recordType: text("record_type").notNull(),
  recordId: text("record_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type AuditLog = InferModel<typeof auditLogs>;
export type NewAuditLog = InferModel<typeof auditLogs, "insert">;
