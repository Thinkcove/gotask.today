export const getStartAndEndOfDay = (dateInput: string | Date): { start: Date; end: Date } => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};
