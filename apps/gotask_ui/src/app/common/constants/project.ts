export const ProjectStatuses = [
  { label: "To Do", color: "#B1AAAA" },
  { label: "In Progress", color: "#F29807" },
  { label: "Hold", color: "#E2A3D5" },
  { label: "Completed", color: "#4CAF50" }
];
export const formatStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case "not-started":
      return "Not Started";
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "blocked":
      return "Blocked";
    default:
      return "Unknown";
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "in-progress":
      return "#FF9800";
    case "hold":
      return "#CE93D8";
    case "completed":
      return "#4CAF50";
    case "not-started":
      return "#B0BEC5";
    case "blocked":
      return "#D32F2F";
    default:
      return "000000";
  }
};

export const PROJECT_STATUS = {
  TO_DO: "to-do",
  IN_PROGRESS: "in-progress",
  HOLD: "hold",
  COMPLETED: "completed"
};

export const PROJECT_WORKFLOW = {
  [PROJECT_STATUS.TO_DO]: [
    PROJECT_STATUS.IN_PROGRESS,
    PROJECT_STATUS.HOLD,
    PROJECT_STATUS.COMPLETED
  ],
  [PROJECT_STATUS.IN_PROGRESS]: [PROJECT_STATUS.HOLD, PROJECT_STATUS.COMPLETED],
  [PROJECT_STATUS.HOLD]: [PROJECT_STATUS.IN_PROGRESS, PROJECT_STATUS.COMPLETED],
  [PROJECT_STATUS.COMPLETED]: [PROJECT_STATUS.IN_PROGRESS, PROJECT_STATUS.HOLD]
};

export const statusOptions = ["not-started", "in-progress", "completed", "blocked"];
export const priorityOptions = ["high", "medium", "low"];
