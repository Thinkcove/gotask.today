import { ITask } from "../../domain/model/task/task";
import { formatDate } from "./common";

export const generateHistoryEntry = (
  existingTask: ITask,
  updatedData: Partial<ITask>
): string | null => {
  const { due_date, status, severity } = updatedData;
  const historyEntries: string[] = [];

  if (due_date && new Date(due_date).getTime() !== existingTask.due_date.getTime()) {
    historyEntries.push(
      `Due Date has been updated from "${formatDate(existingTask.due_date)}" to "${formatDate(new Date(due_date))}".`
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

  return historyEntries.length > 0 ? historyEntries.join(" ") : null;
};
