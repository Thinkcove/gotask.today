// constants/projectConstants.ts

export const ProjectStatuses = [
  { label: "To Do", value: "to-do", color: "#B1AAAA" },
  { label: "In Progress", value: "in-progress", color: "#F29807" },
  { label: "On Hold", value: "on-hold", color: "#E2A3D5" },
  { label: "Completed", value: "completed", color: "#4CAF50" }
];

export const PROJECT_STATUS = {
  TO_DO: "to-do",
  IN_PROGRESS: "in-progress",
  ON_HOLD: "on-hold",
  COMPLETED: "completed"
};

export const getProjectStatusColor = (status: string): string => {
  switch (status) {
    case PROJECT_STATUS.TO_DO:
      return "#B1AAAA";
    case PROJECT_STATUS.IN_PROGRESS:
      return "#F29807";
    case PROJECT_STATUS.ON_HOLD:
      return "#E2A3D5";
    case PROJECT_STATUS.COMPLETED:
      return "#4CAF50";
    default:
      return "#757575"; // default grey
  }
};

export const getProjectProgressValue = (status: string): number => {
  switch (status) {
    case PROJECT_STATUS.TO_DO:
      return 0;
    case PROJECT_STATUS.IN_PROGRESS:
      return 50;
    case PROJECT_STATUS.ON_HOLD:
      return 25;
    case PROJECT_STATUS.COMPLETED:
      return 100;
    default:
      return 0;
  }
};
