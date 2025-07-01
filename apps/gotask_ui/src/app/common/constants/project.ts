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
export const statusOptions = ["not-started", "in-progress", "to-do", "hold","completed", "blocked"];
export const priorityOptions = ["high", "medium", "low"];


