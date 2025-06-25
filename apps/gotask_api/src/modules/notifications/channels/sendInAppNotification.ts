// src/modules/notifications/channels/sendInAppNotification.ts

import { NotificationModel } from "../../../domain/model/notification/notificationModel";
import { NotificationPayload } from "../types/notification.interface";

export const sendInAppNotification = async ({
  userId,
  title,
  message,
  referenceId,
  type
}: NotificationPayload) => {
  try {
    await NotificationModel.create({
      userId,
      title,
      message,
      referenceId,
      type
    });
  } catch (error) {
    console.error("In-App Notification Failed:", error);
  }
};
