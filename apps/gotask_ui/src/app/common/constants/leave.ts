import env from "../env";
import { getData } from "../utils/apiData";
import { withAuth } from "../utils/authToken";

export const getLeaveTypeColor = (leaveType: string): string => {
  switch (leaveType.toLowerCase()) {
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


export const calculatePermissionDuration = (startTime: string, endTime: string): number => {
  const parseTime = (time: string): number => {
    const cleanTime = time.replace(/\s*(AM|PM)\s*/i, "");
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
