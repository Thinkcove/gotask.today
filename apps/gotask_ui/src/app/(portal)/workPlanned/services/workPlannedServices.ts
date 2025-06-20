import env from "@/app/common/env";
import { postData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import useSWR from "swr";
import { WorkPlannedApiResponse } from "../interface/workPlanned";

const WORK_PLANNED_API_URL = `${env.API_BASE_URL}/work-planned/tasks`;

const fetchWorkPlannedReport = async (payload: Record<string, unknown>): Promise<WorkPlannedApiResponse> => {
  return withAuth((token) => {
    return postData(WORK_PLANNED_API_URL, payload, token);
  });
};

export const useWorkPlannedReport = (
  payload: {
    fromDate: string;
    toDate: string;
    userIds: string[];
    selectedProjects?: string[];
  },
  shouldFetch: boolean
) => {
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ["workPlanned", JSON.stringify(payload)] : null,
    async ([, payloadString]) => {
      try {
        const parsedPayload = JSON.parse(payloadString);
        console.log("Fetching work planned report with payload:", parsedPayload);
        
        const response = await fetchWorkPlannedReport(parsedPayload);
        console.log("Work planned report response:", response);
        
        if (response && response.success) {
          return response.data || [];
        }
        
        console.warn("API response indicates failure:", response);
        return [];
      } catch (err) {
        console.error("Error fetching work planned report:", err);
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 2,
      errorRetryInterval: 1000,
    }
  );

  return {
    data: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate, // Expose mutate for manual refresh if needed
  };
};