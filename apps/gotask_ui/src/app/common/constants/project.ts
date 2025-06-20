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

export const statusOptions = ["not-started", "in-progress", "completed", "blocked"];
export const priorityOptions = ["high", "medium", "low"];
