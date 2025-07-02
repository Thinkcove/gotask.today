export const getLeaveTypeColor = (leaveType: string): string => {
  switch (leaveType.toLowerCase()) {
    case "sick":
      return "#ff9800";
    case "personal":
      return "#2196f3";
    default:
      return "#9c27b0";
  }
};

export const LeaveBackgroundColor = {
  num:"20"
};
