import { getData, postData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import env from "@/app/common/env";
import useSWR from "swr";
import { PermissionPayload } from "../interface/interface";

export const fetchAllgetpermission = async () => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/getpermission`;
    const { data } = await getData(url, token);
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
    return response.data;
  });
};
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
