import { NotificationType } from "../notifications/notification.enum";
import { notificationTemplates } from "./notificationTemplates";

export const formatNotificationMessage = (
  type: NotificationType,
  context: Record<string, any>
): { title: string; message: string } => {
  const template = notificationTemplates[type];
  return template
    ? template(context)
    : {
        title: "Notification",
        message: "<p>You have a new notification.</p>"
      };
};
