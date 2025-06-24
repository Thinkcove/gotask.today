import { NotificationType, NotificationChannel } from "../notification.enum";

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  referenceId?: string;
  type: NotificationType;
  channels: NotificationChannel[];
}
