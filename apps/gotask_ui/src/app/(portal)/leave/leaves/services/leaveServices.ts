import env from "@/app/common/env";
import { postData, getData, putData, deleteData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { LeaveApiResponse, LeaveFilters, LeavePayload, LeaveEntry } from "../interface/leave";

const LEAVE_API_URL = `${env.API_BASE_URL}/leave`;
const GET_ALL_LEAVE_URL = `${env.API_BASE_URL}/getallleave`;
const GET_LEAVES_WITH_FILTERS_URL = `${env.API_BASE_URL}/getleaves`;
const GET_LEAVE_BY_ID_URL = (id: string) => `${env.API_BASE_URL}/getleavebyid/${id}`;
const UPDATE_LEAVE_URL = (id: string) => `${env.API_BASE_URL}/leave/${id}`;
const DELETE_LEAVE_URL = (id: string) => `${env.API_BASE_URL}/leave/${id}`;

// Enhanced create leave function with better error handling
export const createLeave = async (payload: LeavePayload): Promise<LeaveApiResponse> => {
  try {
    console.log("Creating leave with payload:", payload);
    
    const response = await withAuth((token) => postData(LEAVE_API_URL, payload as unknown as Record<string, unknown>, token));
    
    console.log("Create leave response:", response);
    
    if (!response) {
      throw new Error("No response received from server");
    }
    
    if (!response.success) {
      throw new Error(response.message || "Failed to create leave");
    }
    
    return response;
  } catch (error: any) {
    console.error("Error in createLeave:", error);
    
    // Re-throw with more context
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error?.message) {
      throw error;
    } else {
      throw new Error("Unknown error occurred while creating leave");
    }
  }
};

export const updateLeave = async (id: string, payload: LeavePayload): Promise<LeaveApiResponse> => {
  try {
    console.log("Updating leave with ID:", id, "payload:", payload);
    
    const response = await withAuth((token) => putData(UPDATE_LEAVE_URL(id), payload as unknown as Record<string, unknown>, token));
    
    console.log("Update leave response:", response);
    
    if (!response) {
      throw new Error("No response received from server");
    }
    
    if (!response.success) {
      throw new Error(response.message || "Failed to update leave");
    }
    
    return response;
  } catch (error: any) {
    console.error("Error in updateLeave:", error);
    
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error?.message) {
      throw error;
    } else {
      throw new Error("Unknown error occurred while updating leave");
    }
  }
};

export const deleteLeave = async (id: string): Promise<LeaveApiResponse> => {
  try {
    console.log("Deleting leave with ID:", id);
    
    const response = await withAuth((token) => deleteData(DELETE_LEAVE_URL(id), token));
    
    console.log("Delete leave response:", response);
    
    if (!response) {
      throw new Error("No response received from server");
    }
    
    if (!response.success) {
      throw new Error(response.message || "Failed to delete leave");
    }
    
    return response;
  } catch (error: any) {
    console.error("Error in deleteLeave:", error);
    
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error?.message) {
      throw error;
    } else {
      throw new Error("Unknown error occurred while deleting leave");
    }
  }
};

const getAllLeaves = async (): Promise<LeaveApiResponse> => {
  return withAuth((token) => getData(GET_ALL_LEAVE_URL, token));
};

const getLeavesWithFilters = async (
  payload: Record<string, unknown>
): Promise<LeaveApiResponse> => {
  return withAuth((token) => postData(GET_LEAVES_WITH_FILTERS_URL, payload, token));
};

const getLeaveById = async (id: string): Promise<LeaveApiResponse> => {
  return withAuth((token) => getData(GET_LEAVE_BY_ID_URL(id), token));
};

// SWR Hooks for data fetching only
export const useGetAllLeaves = (shouldFetch: boolean) => {
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ["getAllLeaves"] : null,
    async () => {
      try {
        const response = await getAllLeaves();

        if (response && response.success) {
          const leaveData = response.data;
          if (Array.isArray(leaveData)) {
            return leaveData as LeaveEntry[];
          } else if (leaveData) {
            return [leaveData] as LeaveEntry[];
          } else {
            return [];
          }
        }
        console.warn("API response indicates failure:", response);
        return [];
      } catch (err) {
        console.error("Error fetching all leaves:", err);
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
  return { data, isLoading, isError: !!error, error, mutate };
};

export const useGetLeavesWithFilters = (payload: LeaveFilters, shouldFetch: boolean) => {
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ["getLeavesWithFilters", JSON.stringify(payload)] : null,
    async ([, payloadString]) => {
      try {
        const parsedPayload = JSON.parse(payloadString);
        const response = await getLeavesWithFilters(parsedPayload);

        if (response && response.success) {
          const leaveData = response.data;

          if (leaveData && typeof leaveData === "object" && "leaves" in leaveData) {
            return leaveData.leaves as LeaveEntry[];
          }

          if (Array.isArray(leaveData)) {
            return leaveData as LeaveEntry[];
          } else if (leaveData) {
            return [leaveData] as LeaveEntry[];
          } else {
            return [];
          }
        }
        console.warn("API response indicates failure:", response);
        return [];
      } catch (err) {
        console.error("Error fetching leaves with filters:", err);
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 2,
      errorRetryInterval: 1000
    }
  );
  return { data, isLoading, isError: !!error, error, mutate };
};

export const useGetLeaveById = (id: string, shouldFetch: boolean) => {
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch && id ? ["getLeaveById", id] : null,
    async () => {
      try {
        const response = await getLeaveById(id);

        if (response && response.success) {
          return response.data as LeaveEntry;
        }
        console.warn("API response indicates failure:", response);
        return null;
      } catch (err) {
        console.error("Error fetching leave by id:", err);
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 2,
      errorRetryInterval: 1000
    }
  );
  return { data, isLoading, isError: !!error, error, mutate };
};

export const useUpdateLeave = (id: string, payload: Partial<LeavePayload>, shouldFetch: boolean) => {
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch && id ? ["updateLeave", id, JSON.stringify(payload)] : null,
    async ([, id, payloadString]) => {
      try {
        const parsedPayload = JSON.parse(payloadString);
        const response = await updateLeave(id, parsedPayload as LeavePayload);

        if (response && response.success) {
          return response.data as LeaveEntry;
        }
        console.warn("API response indicates failure:", response);
        return null;
      } catch (err) {
        console.error("Error updating leave:", err);
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 2,
      errorRetryInterval: 1000
    }
  );
  return { data, isLoading, isError: !!error, error, mutate };
};

// Enhanced delete hook with better error handling
export const useDeleteLeave = () => {
  const { mutate } = useSWRConfig();
  
  const { trigger, isMutating, error } = useSWRMutation(
    "deleteLeave", 
    async (url, { arg }: { arg: string }) => {
      try {
        const response = await deleteLeave(arg);
        
        if (response && response.success) {
          // Invalidate cache to refresh leaves
          await mutate(["getAllLeaves"]);
          return response.data;
        }
        
        throw new Error(response?.message || "Failed to delete leave");
      } catch (err: any) {
        console.error("Error deleting leave:", err);
        throw err;
      }
    }
  );

  return {
    mutate: trigger,
    isLoading: isMutating,
    error,
  };
};

// Hook for creating leave with SWR mutation
export const useCreateLeave = () => {
  const { mutate } = useSWRConfig();
  
  const { trigger, isMutating, error } = useSWRMutation(
    "createLeave",
    async (url, { arg }: { arg: LeavePayload }) => {
      try {
        const response = await createLeave(arg);
        
        if (response && response.success) {
          // Invalidate cache to refresh leaves
          await mutate(["getAllLeaves"]);
          return response.data;
        }
        
        throw new Error(response?.message || "Failed to create leave");
      } catch (err: any) {
        console.error("Error creating leave:", err);
        throw err;
      }
    }
  );

  return {
    mutate: trigger,
    isLoading: isMutating,
    error,
  };
};