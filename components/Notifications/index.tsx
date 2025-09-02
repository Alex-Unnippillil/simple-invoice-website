import React, { useState } from 'react';
import type { Notification } from '../../db/schema/notifications';

interface ListProps {
  notifications: Notification[];
  pageSize?: number;
}

// Bell icon that toggles the notification list
export const NotificationBell: React.FC<ListProps> = ({ notifications, pageSize = 5 }) => {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <button onClick={() => setOpen(!open)} aria-label="Notifications">
        <span role="img" aria-label="bell">🔔</span>
        {unread > 0 && <span>({unread})</span>}
      </button>
      {open && <NotificationList notifications={notifications} pageSize={pageSize} />}
    </div>
  );
};

// Paginated list of notifications
export const NotificationList: React.FC<ListProps> = ({ notifications, pageSize = 5 }) => {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(notifications.length / pageSize);
  const start = page * pageSize;
  const visible = notifications.slice(start, start + pageSize);

  return (
    <div>
      <ul>
        {visible.map((n) => (
          <li key={n.id} style={{ fontWeight: n.read ? 'normal' : 'bold' }}>
            {n.message}
          </li>
        ))}
      </ul>
      {pages > 1 && (
        <div>
          <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
            Prev
          </button>
          <span>
            {page + 1} / {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, pages - 1))}
            disabled={page === pages - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
