import { NotificationType } from "./notification.enum";

export const formatNotificationMessage = (
  type: NotificationType,
  context: Record<string, string>
): { title: string; message: string } => {
  switch (type) {
    case NotificationType.TASK_ASSIGNED:
      return {
        title: "Task Assigned",
        message: `You have been assigned the task "${context.taskTitle}".`
      };

    case NotificationType.WORKLOG_REMINDER:
      return {
        title: "Worklog Missing",
        message: "Reminder: You haven't submitted today's worklog."
      };

    case NotificationType.COMMENT_ADDED:
      return {
        title: "New Comment",
        message: `A new comment was added to "${context.taskTitle}".`
      };

    case NotificationType.LEAVE_APPROVED:
      return {
        title: "Leave Status Updated",
        message: `Your leave request has been ${context.status}.`
      };

    default:
      return {
        title: "Notification",
        message: "You have a new notification."
      };
  }
};

export const logNotification = (userId: string, type: NotificationType, channel: string) => {
  console.log(`[Notification Log] User: ${userId} | Type: ${type} | Channel: ${channel}`);
};
