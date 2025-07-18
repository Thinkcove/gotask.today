export const ProjectStatuses = [
  { label: "To Do", color: "#B1AAAA" },
  { label: "In Progress", color: "#F29807" },
  { label: "Hold", color: "#E2A3D5" },
  { label: "Completed", color: "#4CAF50" }
];

export const formatStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case "to-do":
      return "To-Do";
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
    case "to-do":
      return "#B0BEC5";
    case "in-progress":
      return "#FF9800";
    case "hold":
      return "#CE93D8";
    case "completed":
      return "#4CAF50";
    default:
      return "#B0BEC5";
  }
};
export const statusOptions = ["to-do", "in-progress", "hold", "completed"];

export const priorityOptions = ["high", "medium", "low"];

export const GOAL_STATUS = {
  COMPLETED: "completed",
  IN_PROGRESS: "in-progress",
  TO_DO: "to-do"
} as const;

export const DEFAULT_STORY_PAGE_SIZE = 12;
