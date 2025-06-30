export const getLeaveTypeColor = (leaveType: string): string => {
  switch (leaveType.toLowerCase()) {
    case "sick leave":
    case "sick":
      return "#ff9800";
    case "personal leave":
    case "personal":
      return "#2196f3";
    case "vacation":
      return "#4caf50";
    case "emergency":
      return "#f44336";
    default:
      return "#9c27b0";
  }
};
