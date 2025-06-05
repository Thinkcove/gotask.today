import { ITask } from "../../domain/model/task/task";
import { formatDate } from "./common";

export const generateHistoryEntry = (
  existingTask: ITask,
  updatedData: Partial<ITask>
): string | null => {
  const { due_date, status, severity } = updatedData;
  const historyEntries: string[] = [];

  const existingDueDateTime = existingTask.due_date?.getTime() ?? null;
  const updatedDueDateTime = due_date?.getTime() ?? null;

  // Only compare if the updated due date is not undefined
  if (due_date && updatedDueDateTime !== existingDueDateTime) {
    const fromDate = existingTask.due_date ? formatDate(existingTask.due_date) : "None";
    const toDate = formatDate(due_date);
    historyEntries.push(`Due Date has been updated from "${fromDate}" to "${toDate}".`);
  }
  if (status && status !== existingTask.status) {
    historyEntries.push(`Status has been updated from "${existingTask.status}" to "${status}".`);
  }
  if (severity && severity !== existingTask.severity) {
    historyEntries.push(
      `Severity has been updated from "${existingTask.severity}" to "${severity}".`
    );
  }

  return historyEntries.length > 0 ? historyEntries.join(" ") : null;
};
