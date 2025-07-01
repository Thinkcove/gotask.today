export const STATUS_CONFIG = {
  ALL_STATUS: "All",
  STATUS_OPTIONS: [
    { id: "Active", name: "Active" },
    { id: "Inactive", name: "Inactive" }
  ]
};

export const getUserStatusColor = (status: string) => {
  if (!status) return "gray";
  switch (status.toLowerCase()) {
    case "active":
      return "#4CAF50";
    case "inactive":
      return "#F44336";
    default:
      return "#9E9E9E";
  }
};
