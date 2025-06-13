import { ITask } from "../../domain/model/task/task";
import { formatDate } from "./common";

export const generateHistoryEntry = (
  existingTask: ITask,
  updatedData: Partial<ITask>
): string | null => {
  const {
    due_date,
    start_date,
    status,
    severity,
    user_estimated,
    user_id,
    user_name,
    project_id,
    project_name
  } = updatedData;

  const historyEntries: string[] = [];

  if (user_id && user_id !== existingTask.user_id) {
    historyEntries.push(
      `Assignee has been changed from "${existingTask.user_name}" to "${user_name}".`
    );
  }

  if (project_id && project_id !== existingTask.project_id) {
    historyEntries.push(
      `Project has been changed from "${existingTask.project_name}" to "${project_name}".`
    );
  }

  if (
    due_date &&
    existingTask?.due_date &&
    new Date(due_date).getTime() !== existingTask.due_date.getTime()
  ) {
    historyEntries.push(
      `Due Date has been updated from "${formatDate(existingTask.due_date)}" to "${formatDate(new Date(due_date))}".`
    );
  }

  if (
    start_date &&
    existingTask?.start_date &&
    new Date(start_date).getTime() !== existingTask.start_date.getTime()
  ) {
    historyEntries.push(
      `Start Date has been updated from "${formatDate(existingTask.start_date)}" to "${formatDate(new Date(start_date))}".`
    );
  }

  if (status && status !== existingTask.status) {
    historyEntries.push(`Status has been updated from "${existingTask.status}" to "${status}".`);
  }
  if (severity && severity !== existingTask.severity) {
    historyEntries.push(
      `Severity has been updated from "${existingTask.severity}" to "${severity}".`
    );
  }

  if (user_estimated !== undefined && user_estimated !== existingTask.user_estimated) {
    historyEntries.push(
      `User Estimated Time has been updated from "${existingTask.user_estimated}" to "${user_estimated}".`
    );
  }

  return historyEntries.length > 0 ? historyEntries.join(" ") : null;
};
