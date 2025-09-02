import React, { useEffect, useState } from "react";
import { AuditLog } from "../db/schema/audit_logs";
import { getAuditLogsByTenant } from "../db/auditLogs";

export interface AuditLogViewerProps {
  tenantId: string;
  fetchLogs?: (tenantId: string) => Promise<AuditLog[]>;
}

// Emergency switch to disable all flagged features
export const EmergencySwitch: React.FC = () => {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    fetch('/api/flags')
      .then((r) => r.json())
      .then((data) => setDisabled(data.disabled));
  }, []);

  async function toggle() {
    const res = await fetch('/api/flags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disabled: !disabled }),
    });
    if (res.ok) {
      const data = await res.json();
      setDisabled(data.disabled);
    }
  }

  return (
    <div>
      <label>
        <input type="checkbox" checked={disabled} onChange={toggle} />
        Disable all features
      </label>
    </div>
  );
};

// Displays audit log entries for the given tenant
export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ tenantId, fetchLogs }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const loader = fetchLogs ?? getAuditLogsByTenant;

  useEffect(() => {
    loader(tenantId).then(setLogs);
  }, [tenantId, loader]);

  return (
    <>
      <EmergencySwitch />
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
    </>
  );
};
