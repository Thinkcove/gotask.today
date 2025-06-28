import { NotificationPayload } from "./types/notification.interface";
import { NotificationChannelConfig } from "./notification.config";
import { NotificationChannel } from "./notification.enum";

// Channel-specific handlers
import { sendEmailNotification } from "./channels/sendEmailNotification";
import { sendSMSNotification } from "./channels/sendSMSNotification";
import { sendInAppNotification } from "./channels/sendInAppNotification";

/**
 * Centralized notification dispatcher
 */
export const sendNotification = async (payload: NotificationPayload) => {
  const tasks: Promise<any>[] = [];

  if (payload.channels.includes(NotificationChannel.EMAIL) && NotificationChannelConfig.email) {
    tasks.push(sendEmailNotification(payload));
  }

  if (payload.channels.includes(NotificationChannel.IN_APP) && NotificationChannelConfig.inApp) {
    tasks.push(sendInAppNotification(payload));
  }

  if (payload.channels.includes(NotificationChannel.SMS) && NotificationChannelConfig.sms) {
    tasks.push(sendSMSNotification(payload));
  }

  // Asynchronous and fault-tolerant execution
  await Promise.allSettled(tasks);
};
