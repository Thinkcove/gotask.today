import env from "@/app/common/env";
import { getData, postData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import useSWR from "swr";

const API_URL = `${env.API_BASE_URL}/timeReport`;

const fetchTimeReport = async (payload: Record<string, unknown>) => {
  return withAuth((token) => {
    return postData(API_URL, payload, token);
  });
};

export const useUserTimeLogReport = (
  payload: {
    fromDate: string;
    toDate: string;
    userIds: string[];
    showTasks: boolean;
    selectedProjects?: string[];
  },
  shouldFetch: boolean
) => {
  const { data, error, isLoading } = useSWR(
    shouldFetch ? ["timeReport", payload] : null,
    async ([, body]) => {
      const response = await fetchTimeReport(body);
      return response;
    }
  );

  return {
    data: data?.data || [],
    isLoading,
    isError: !!error
  };
};

export const fetchAllPermissions = async () => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/getpermission`;
    const { data } = await getData(url, token);
    return data || [];
  });
};
