import env from "@/app/common/env";
import { postData, getData, putData, deleteData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { LeaveFilters, LeavePayload, LeaveEntry } from "../interface/leaveInterface";

const LEAVE_API_URL = `${env.API_BASE_URL}/leave`;
const GET_ALL_LEAVE_URL = `${env.API_BASE_URL}/getallleave`;
const GET_LEAVES_WITH_FILTERS_URL = `${env.API_BASE_URL}/getleaves`;
const GET_LEAVE_BY_ID_URL = (id: string) => `${env.API_BASE_URL}/getleavebyid/${id}`;
const UPDATE_LEAVE_URL = (id: string) => `${env.API_BASE_URL}/leave/${id}`;
const DELETE_LEAVE_URL = (id: string) => `${env.API_BASE_URL}/leave/${id}`;

// Create a new leave
export const createLeave = async (payload: LeavePayload) => {
  return withAuth(async (token) => {
    const response = await postData(
      LEAVE_API_URL,
      payload as unknown as Record<string, unknown>,
      token
    );
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  });
};

// Update an existing leave
export const updateLeave = async (id: string, payload: LeavePayload) => {
  return withAuth(async (token) => {
    const response = await putData(
      UPDATE_LEAVE_URL(id),
      payload as unknown as Record<string, unknown>,
      token
    );
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  });
};

// Delete a leave
export const deleteLeave = async (id: string) => {
  return withAuth(async (token) => {
    const response = await deleteData(DELETE_LEAVE_URL(id), token);
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  });
};

// Get all leaves
export const getAllLeaves = async () => {
  return withAuth(async (token) => {
    const response = await getData(GET_ALL_LEAVE_URL, token);
    if (!response.success) {
      throw new Error(response.message);
    }
    const leaveData = response.data;
    return Array.isArray(leaveData) ? leaveData : leaveData ? [leaveData] : [];
  });
};

// Get leaves with filters
export const getLeavesWithFilters = async (payload: LeaveFilters) => {
  return withAuth(async (token) => {
    const response = await postData(
      GET_LEAVES_WITH_FILTERS_URL,
      payload as unknown as Record<string, unknown>,
      token
    );
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  });
};

// Get leave by ID
export const getLeaveById = async (id: string) => {
  if (!id) throw new Error("Leave ID is required");
  return withAuth(async (token) => {
    const response = await getData(GET_LEAVE_BY_ID_URL(id), token);
    if (!response.success) {
      throw new Error(response.message);
    }
    if (!response.data) {
      throw new Error("Leave data missing in response");
    }
    return response.data;
  });
};

export const useGetAllLeaves = (shouldFetch: boolean) => {
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ["getAllLeaves"] : null,
    async () => {
      const leaves = await getAllLeaves();
      return leaves as LeaveEntry[];
    }
  );

  return { data, isLoading, isError: !!error, error, mutate };
};

export const useGetLeavesWithFilters = (payload: LeaveFilters, shouldFetch: boolean) => {
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ["getLeavesWithFilters", JSON.stringify(payload)] : null,
    async () => {
      const response = await getLeavesWithFilters(payload);
      return response as {
        leaves: LeaveEntry[];
        total_count: number;
        total_pages: number;
        current_page: number;
      };
    }
  );

  return {
    data: data?.leaves || [],
    totalCount: data?.total_count || 0,
    totalPages: data?.total_pages || 0,
    currentPage: data?.current_page || 1,
    isLoading,
    isError: !!error,
    error,
    mutate
  };
};

export const useGetLeaveById = (id: string, shouldFetch: boolean) => {
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch && id ? ["getLeaveById", id] : null,
    async () => {
      const leave = await getLeaveById(id);
      return leave as LeaveEntry;
    }
  );

  return { data, isLoading, isError: !!error, error, mutate };
};

export const useUpdateLeave = (
  id: string,
  payload: Partial<LeavePayload>,
  shouldFetch: boolean
) => {
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch && id ? ["updateLeave", id, JSON.stringify(payload)] : null,
    async () => {
      const leave = await updateLeave(id, payload as LeavePayload);
      return leave as LeaveEntry;
    },
    { revalidateOnFocus: false }
  );

  return { data, isLoading, isError: !!error, error, mutate };
};

export const useDeleteLeave = () => {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation(
    "deleteLeave",
    async (url, { arg }: { arg: string }) => {
      const response = await deleteLeave(arg);
      await mutate(["getAllLeaves"]);
      await mutate(["getLeavesWithFilters"]);
      return response;
    }
  );

  return {
    mutate: trigger,
    isLoading: isMutating,
    error
  };
};

export const useCreateLeave = () => {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation(
    "createLeave",
    async (url, { arg }: { arg: LeavePayload }) => {
      const response = await createLeave(arg);
      await mutate(["getAllLeaves"]);
      await mutate(["getLeavesWithFilters"]);
      return response;
    }
  );

  return {
    mutate: trigger,
    isLoading: isMutating,
    error
  };
};
