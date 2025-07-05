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


