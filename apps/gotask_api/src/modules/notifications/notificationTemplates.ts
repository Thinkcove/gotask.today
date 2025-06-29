import { NotificationType } from "../notifications/notification.enum";

export const notificationTemplates = {
  [NotificationType.TASK_ASSIGNED]: (context: any) => ({
    title: `Task Assigned: ${context.taskTitle}`,
    message: `
      <p>Hi ${context.assigneeName || "there"},</p>
      <p>You have been assigned a task in project <b>${context.projectName}</b>.</p>
      <ul>
        <li><strong>Task:</strong> ${context.taskTitle}</li>
        <li><strong>Due Date:</strong> ${context.dueDate}</li>
        <li><strong>Assigned By:</strong> ${context.createdBy}</li>
      </ul>
      <p>Click <a href="${context.taskLink}">here</a> to view the task.</p>
      <br/>
      <p style="font-size:12px;color:#777;">This is an automated notification from the HRMS system.</p>
    `
  }),

  [NotificationType.LEAVE_APPROVED]: (context: any) => ({
    title: `Leave ${context.status}`,
    message: `
      <p>Hi ${context.employeeName},</p>
      <p>Your leave request from <strong>${context.startDate}</strong> to <strong>${context.endDate}</strong> has been <strong>${context.status}</strong>.</p>
    `
  }),

  [NotificationType.COMMENT_ADDED]: (context: any) => ({
    title: `Comment Added to Task: ${context.taskTitle}`,
    message: `
      <p><strong>${context.commentedBy}</strong> commented:</p>
      <blockquote>${context.comment}</blockquote>
    `
  }),

  [NotificationType.WORKLOG_REMINDER]: (context: any) => ({
    title: `Worklog Reminder`,
    message: `
      <p>Hi ${context.name},</p>
      <p>Please remember to submit your worklog for <strong>${context.date}</strong>.</p>
    `
  })
};
