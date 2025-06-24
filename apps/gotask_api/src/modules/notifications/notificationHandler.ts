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
  const { channels, ...rest } = payload;

  const tasks: Promise<any>[] = [];

  if (channels.includes(NotificationChannel.EMAIL) && NotificationChannelConfig.email) {
    tasks.push(sendEmailNotification(rest));
  }

  if (channels.includes(NotificationChannel.IN_APP) && NotificationChannelConfig.inApp) {
    tasks.push(sendInAppNotification(rest));
  }

  if (channels.includes(NotificationChannel.SMS) && NotificationChannelConfig.sms) {
    tasks.push(sendSMSNotification(rest));
  }

  // Asynchronous and fault-tolerant execution
  await Promise.allSettled(tasks);
};
