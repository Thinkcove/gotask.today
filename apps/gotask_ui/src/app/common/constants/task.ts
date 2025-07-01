export const TaskStatuses = [
  { label: "To Do", color: "#B1AAAA" },
  { label: "In Progress", color: "#F29807" },
  { label: "Need Info", color: "#939FCF" },
  { label: "Hold", color: "#E2A3D5" },
  { label: "In Review", color: "#CDDC39" },
  { label: "Under Review", color: "#FF6F61" },
  { label: "Reviewed", color: "#3F51B5" },
  { label: "Completed", color: "#4CAF50" }
];

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "to-do":
      return "#B1AAAA";
    case "in-progress":
      return "#FF9800";
    case "need-info":
      return "#03A9F4";
    case "hold":
      return "#CE93D8";
    case "in-review":
      return "#CDDC39";
    case "under-review":
      return "#FF6F61";
    case "reviewed":
      return "#3F51B5";
    case "completed":
      return "#4CAF50";
    default:
      return "#000000";
  }
};

export const getProgressValue = (status: string) => {
  switch (status) {
    case "to-do":
      return 0;
    case "in-progress":
      return 33;
    case "need-info":
      return 50;
    case "hold":
      return 40;
    case "in-review":
      return 80;
    case "under-review":
      return 85;
    case "reviewed":
      return 90;
    case "completed":
      return 100;
    default:
      return 0;
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "#ef5350"; // Light Red
    case "high":
      return "#ff8a65"; // Red
    case "medium":
      return "#ffd54f"; // Orange
    case "low":
      return "#a5d6a7"; // Green
    default:
      return "#757575"; // Grey
  }
};

// Standardized task status keys
export const TASK_STATUS = {
  TO_DO: "to-do",
  IN_PROGRESS: "in-progress",
  NEED_INFO: "need-info",
  HOLD: "hold",
  IN_REVIEW: "in-review",
  UNDER_REVIEW: "under-review",
  REVIEWED: "reviewed",
  COMPLETED: "completed"
};

// Updated: Any status can move to any other status
export const TASK_WORKFLOW = {
  [TASK_STATUS.TO_DO]: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.NEED_INFO, TASK_STATUS.HOLD],
  [TASK_STATUS.IN_PROGRESS]: [
    TASK_STATUS.NEED_INFO,
    TASK_STATUS.HOLD,
    TASK_STATUS.IN_REVIEW,
    TASK_STATUS.COMPLETED
  ],
  [TASK_STATUS.NEED_INFO]: [
    TASK_STATUS.IN_PROGRESS,
    TASK_STATUS.HOLD,
    TASK_STATUS.IN_REVIEW,
    TASK_STATUS.COMPLETED
  ],
  [TASK_STATUS.HOLD]: [
    TASK_STATUS.IN_PROGRESS,
    TASK_STATUS.NEED_INFO,
    TASK_STATUS.IN_REVIEW,
    TASK_STATUS.COMPLETED
  ],
  [TASK_STATUS.IN_REVIEW]: [TASK_STATUS.UNDER_REVIEW, TASK_STATUS.REVIEWED],
  [TASK_STATUS.UNDER_REVIEW]: [TASK_STATUS.REVIEWED],
  [TASK_STATUS.REVIEWED]: [
    TASK_STATUS.IN_PROGRESS,
    TASK_STATUS.HOLD,
    TASK_STATUS.NEED_INFO,
    TASK_STATUS.COMPLETED
  ],
  [TASK_STATUS.COMPLETED]: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.NEED_INFO, TASK_STATUS.HOLD]
};

export const TASK_SEVERITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical"
};

export const getVariationColor = (variation: string) => {
  if (!variation) return "#grey";
  const isNegative = variation.trim().startsWith("-");
  const isZero = variation.trim() === "0d0h";
  if (isZero) return "#grey";
  return isNegative ? "green" : "red";
};

export const TASK_CALCULATION = 70;
export const TASK_VARIATION = 30;
export const TASK_HOURS = 8;

export enum TaskSortField {
  DUE_DATE = "due_date",
  USER_NAME = "user_name"
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc"
}
