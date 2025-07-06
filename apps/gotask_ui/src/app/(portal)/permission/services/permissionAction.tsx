import { getData, postData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import env from "@/app/common/env";
import useSWR from "swr";
// Interface for permission payload
export interface PermissionPayload {
  date: string;
  start_time: string;
  end_time: string;
}

// Interface for permission response (adjust based on your API response)
export interface PermissionResponse {
  id?: string;
  date: string;
  start_time: string;
  end_time: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}
export const fetchAllgetpermission = async () => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/getpermission`;
    const { data } = await getData(url, token);
    console.log(data);

    return data || [];
  });
};

export const createPermission = async (formData: PermissionPayload) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/permission`;
    return postData(url, formData as unknown as Record<string, unknown>, token);
  });
};


export const getPermissionById = async (permissionId: string) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/getpermissionbyid/${permissionId}`;
    const response = await getData(url, token);
    console.log("permissionId", response);

    // Handle the response structure based on your API response
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch permission");
    }

    if (!response.data) {
      throw new Error("Permission data missing in response");
    }

    return response.data;
  });
};

// SWR hook to use the permission data
export const usePermissionById = (permissionId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    permissionId ? `permission-${permissionId}` : null,
    () => getPermissionById(permissionId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3
    }
  );

  return {
    permission: data,
    isLoading,
    isError: error,
    mutate
  };
};



