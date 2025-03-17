export const statuses = [
  { label: "To Do", color: "#B1AAAA" },
  { label: "In Progress", color: "#F29807" },
  { label: "Need Info", color: "#9C27B0" },
  { label: "Hold", color: "#CD1922" },
  { label: "Completed", color: "#4CAF50" },
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case "to-do":
      return "#B1AAAA";
    case "in-progress":
      return "#F29807";
    case "need-info":
      return "#9C27B0";
    case "hold":
      return "#CD1922";
    case "completed":
      return "#4CAF50";
    default:
      return "#000"; // Default black
  }
};

export const TASK_STATUS = {
  TO_DO: "to-do",
  IN_PROGRESS: "in-progress",
  NEED_INFO: "need-info",
  HOLD: "hold",
  COMPLETED: "completed",
};

export const TASK_SEVERITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};
