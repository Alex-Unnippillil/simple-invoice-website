import { eq } from "drizzle-orm";
import { auditLogs, AuditLog } from "./schema/audit_logs";
import { db } from "./client"; // assumed database client

// Fetches audit log entries for a particular tenant
export async function getAuditLogsByTenant(tenantId: string): Promise<AuditLog[]> {
  return db.select().from(auditLogs).where(eq(auditLogs.tenantId, tenantId));
}
