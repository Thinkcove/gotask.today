import { ITask } from "../../domain/model/task";

export const generateHistoryEntry = (
  existingTask: ITask,
  updatedData: Partial<ITask>,
): string | null => {
  const { due_date, status, severity } = updatedData;
  let historyEntries: string[] = [];

  if (due_date && new Date(due_date).getTime() !== existingTask.due_date.getTime()) {
    historyEntries.push(
      `Due Date has been updated from "${existingTask.due_date.toISOString()}" to "${new Date(due_date).toISOString()}".`,
    );
  }
  if (status && status !== existingTask.status) {
    historyEntries.push(`Status has been updated from "${existingTask.status}" to "${status}".`);
  }
  if (severity && severity !== existingTask.severity) {
    historyEntries.push(
      `Severity has been updated from "${existingTask.severity}" to "${severity}".`,
    );
  }

  return historyEntries.length > 0 ? historyEntries.join(" ") : null;
};
