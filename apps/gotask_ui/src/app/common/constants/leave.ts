export   const getLeaveTypeColor = (leaveType: string): string => {
  switch (leaveType.toLowerCase()) {
    case "sick leave":
    case "sick":
      return "#ff9800"; // Orange
    case "personal leave":
    case "personal":
      return "#2196f3"; // Blue
    case "vacation":
      return "#4caf50"; // Green
    case "emergency":
      return "#f44336"; // Red
    default:
      return "#9c27b0"; // Purple
  }
};