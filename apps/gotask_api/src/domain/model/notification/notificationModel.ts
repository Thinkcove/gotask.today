import mongoose, { Schema, Document } from "mongoose";
import { NotificationType } from "../../../modules/notifications/notification.enum";

export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  referenceId?: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    referenceId: { type: String },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    isRead: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);
