export const TaskStatuses = [
  { label: "To Do", color: "#B1AAAA" },
  { label: "In Progress", color: "#F29807" },
  { label: "Need Info", color: "#939FCF" },
  { label: "Hold", color: "#E2A3D5" },
  { label: "Completed", color: "#4CAF50" }
];

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "to-do":
      return "#F44336";
    case "in-progress":
      return "#FF9800";
    case "need-info":
      return "#03A9F4";
    case "hold":
      return "#CE93D8";
    case "completed":
      return "#4CAF50";
    default:
      return "000000";
  }
};

export const getProgressValue = (status: string) => {
  switch (status) {
    case "to-do":
      return 0;
    case "in-progress":
      return 33;
    case "need-info":
      return 66;
    case "hold":
      return 50;
    case "completed":
      return 100;
    default:
      return 0;
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

export const TASK_WORKFLOW = {
  [TASK_STATUS.TO_DO]: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.HOLD],
  [TASK_STATUS.IN_PROGRESS]: [TASK_STATUS.NEED_INFO, TASK_STATUS.HOLD, TASK_STATUS.COMPLETED],
  [TASK_STATUS.NEED_INFO]: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.HOLD],
  [TASK_STATUS.HOLD]: [TASK_STATUS.TO_DO, TASK_STATUS.IN_PROGRESS],
  [TASK_STATUS.COMPLETED]: []
};

export const TASK_SEVERITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical"
};
