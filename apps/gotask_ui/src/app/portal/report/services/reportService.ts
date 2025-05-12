import env from "@/app/common/env";
import { postData } from "@/app/common/utils/apiData";
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
    showProjects: boolean;
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
