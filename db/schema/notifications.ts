// Schema definition for notifications table
// Each notification tracks whether it has been read by the user.

export interface Notification {
  id: number;
  userId: number;
  message: string;
  /**
   * Flag indicating whether the notification has been read.
   * `false` means the user has not yet read the notification.
   */
  read: boolean;
  createdAt: Date;
}

// In-memory placeholder list for notifications. In a real application this
// would be backed by a persistent database table.
export const notifications: Notification[] = [];
