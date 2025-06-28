import { getData, postData, putData, deleteData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import useSWR from "swr";
import env from "@/app/common/env";
import { ILeave, ILeaveFilters } from "../interface/leave";

// Fetch all leaves
export const fetchAllLeaves = () =>
  withAuth((token) => getData(`${env.API_BASE_URL}/getallleave`, token));

export const useAllLeaves = () => {
  const { data, mutate } = useSWR([`fetchallleaves`], fetchAllLeaves, {
    revalidateOnFocus: false
  });
  return {
    getAll: data?.data || [],
    mutate
  };
};

// Fetch leaves with filters
export const fetchLeavesWithFilters = (filters: ILeaveFilters) =>
  withAuth((token) => postData(`${env.API_BASE_URL}/getleaves`, filters as Record<string, unknown>, token));

export const useLeavesWithFilters = (filters: ILeaveFilters) => {
  const { data, mutate } = useSWR(
    [`fetchleaveswithfilters`, JSON.stringify(filters)], 
    () => fetchLeavesWithFilters(filters),
    {
      revalidateOnFocus: false
    }
  );
  return {
    getAll: data?.data?.leaves || [],
    totalCount: data?.data?.total_count || 0,
    totalPages: data?.data?.total_pages || 0,
    currentPage: data?.data?.current_page || 1,
    mutate
  };
};

// Create new leave
export const createLeave = async (formData: ILeave) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/leave`;
    return postData(url, formData as unknown as Record<string, unknown>, token);
  });
};

// Update leave
export const updateLeave = async (id: string, formData: Partial<ILeave>) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/leave/${id}`;
    return putData(url, formData as unknown as Record<string, unknown>, token);
  });
};

// Delete leave
export const deleteLeave = async (id: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/leave/${id}`;
    return deleteData(url, token);
  });
};

// Get leave by ID
const getLeaveById = async ([, id]: [string, string]): Promise<ILeave | null> => {
  const result = await withAuth(async (token) => {
    return await getData(`${env.API_BASE_URL}/getleavebyid/${id}`, token);
  });

  if (!result || (result && typeof result === "object" && "error" in result)) {
    return null;
  }

  return result.data;
};

export const useLeaveById = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`fetchLeaveById`, id], 
    getLeaveById, 
    {
      revalidateOnFocus: false
    }
  );

  return {
    leave: data ?? null,
    isLoading,
    mutate,
    error: error ? error.message : null
  };
};