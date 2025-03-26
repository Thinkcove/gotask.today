export const statuses = [
  { label: "To Do", color: "#B1AAAA" },
  { label: "In Progress", color: "#F29807" },
  { label: "Need Info", color: "#939FCF" },
  { label: "Hold", color: "#E2A3D5" },
  { label: "Completed", color: "#4CAF50" }
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case "to-do":
      return "#B1AAAA";
    case "in-progress":
      return "#F29807";
    case "need-info":
      return "#939FCF";
    case "hold":
      return "#E2A3D5";
    case "completed":
      return "#4CAF50";
    default:
      return "#000"; // Default black
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "#D32F2F"; // Red
    case "medium":
      return "#FFA000"; // Orange
    case "low":
      return "#388E3C"; // Green
    default:
      return "#757575"; // Grey
  }
};

export const TASK_STATUS = {
  TO_DO: "to-do",
  IN_PROGRESS: "in-progress",
  NEED_INFO: "need-info",
  HOLD: "hold",
  COMPLETED: "completed"
};

export const TASK_SEVERITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical"
};
