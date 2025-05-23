export const getUserStatusColor = (status: boolean): string => {
  return status ? "#4CAF50" : "#F44336"; // Green for active, red for inactive
};

export const statusOptions = [
  { id: "true", name: "Active" },
  { id: "false", name: "In Active" }
];
