import { EnhancedTimeLogGridProps } from "@/app/(portal)/report/interface/timeLog";
import env from "../env";
import { getData } from "../utils/apiData";
import { withAuth } from "../utils/authToken";

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
  num: "20"
};


export const fetchAllPermissions = async () => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/getpermission`;
    const { data } = await getData(url, token);
    return data || [];
  });
};


export const PERMISSION_BACKGROUND_COLOR = {
  num: "20" 
};

export const getPermissionColor = () => {
  return "#009688";
};

export const formatPermissionTime = (startTime: string, endTime: string): string => {
  const formatTime = (time: string): string => {
    if (time.includes("AM") || time.includes("PM")) {
      return time;
    }
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

export const calculatePermissionDuration = (startTime: string, endTime: string): number => {
  const parseTime = (time: string): number => {
    let cleanTime = time.replace(/\s*(AM|PM)\s*/i, "");
    const [hours, minutes] = cleanTime.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;

    if (time.toUpperCase().includes("PM") && hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (time.toUpperCase().includes("AM") && hours === 12) {
      totalMinutes -= 12 * 60;
    }

    return totalMinutes;
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);
  const durationMinutes = endMinutes - startMinutes;

  return Math.round((durationMinutes / 60) * 100) / 100; 
};
