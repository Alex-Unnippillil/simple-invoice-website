import React, { useEffect, useState } from "react";
import { AuditLog } from "../db/schema/audit_logs";
import { getAuditLogsByTenant } from "../db/auditLogs";

export interface AuditLogViewerProps {
  tenantId: string;
  fetchLogs?: (tenantId: string) => Promise<AuditLog[]>;
}

// Displays audit log entries for the given tenant
export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ tenantId, fetchLogs }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const loader = fetchLogs ?? getAuditLogsByTenant;

  useEffect(() => {
    loader(tenantId).then(setLogs);
  }, [tenantId, loader]);

  return (
    <table>
      <thead>
        <tr>
          <th>When</th>
          <th>User</th>
          <th>Action</th>
          <th>Record</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id}>
            <td>{new Date(log.createdAt).toLocaleString()}</td>
            <td>{log.userId}</td>
            <td>{log.action}</td>
            <td>{`${log.recordType}#${log.recordId}`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
