import useSWR from "swr";
import env from "@/app/common/env";
import { deleteData, getData, postData, putData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";

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

export const usePermissionById = (permissionId: string | null | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(
    permissionId ? `permission-${permissionId}` : null,
    () => {
      if (!permissionId) {
        throw new Error("Permission ID is required");
      }
      return getPermissionById(permissionId);
    }
  );

  return {
    permission: data,
    isLoading,
    isError: error,
    mutate
  };
};

export const deletePermission = async (permissionId: string) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/permission/${permissionId}`;
    const response = await deleteData(url, token);
    return response;
  });
};
