import env from "@/app/common/env";
import { postData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import { UploadResponse } from "../interface/uploadInterface";

// Upload attendance file
export const uploadAttendance = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/api/attendance/upload`;
    return postData(url, formData, token);
  });
};
