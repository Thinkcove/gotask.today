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
  num: "20" // 20% opacity for background
};

export const getPermissionColor = () => {
  return "#009688";
};

export const formatPermissionTime = (startTime: string, endTime: string): string => {
  // Handle different time formats
  const formatTime = (time: string): string => {
    // If time contains AM/PM, return as is
    if (time.includes("AM") || time.includes("PM")) {
      return time;
    }
    // If time is in HH:MM format, convert to 12-hour format
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

// Utility function to calculate permission duration in hours
export const calculatePermissionDuration = (startTime: string, endTime: string): number => {
  const parseTime = (time: string): number => {
    let cleanTime = time.replace(/\s*(AM|PM)\s*/i, "");
    const [hours, minutes] = cleanTime.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;

    // Handle AM/PM conversion
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

  return Math.round((durationMinutes / 60) * 100) / 100; // Round to 2 decimal places
};

// Interface for Permission Entry
export interface PermissionEntry {
  _id: string;
  user_id: string;
  user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  comments: string[];
  id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Updated interface to include permission data
export interface EnhancedTimeLogGridPropsWithPermissions extends EnhancedTimeLogGridProps {
  permissionData?: PermissionEntry[];
}