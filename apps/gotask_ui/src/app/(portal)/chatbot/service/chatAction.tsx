import env from "@/app/common/env";
import { getData, postData, deleteData } from "@/app/common/utils/apiData";
import useSWR from "swr";
import { withAuth } from "@/app/common/utils/authToken";
import { QueryHistoryEntry, QueryResponse, UploadResponse } from "../interface/chatInterface";

// Fetch all query history
const fetchQueryHistory = async () => {
  return withAuth((token) => {
    return getData(`${env.API_BASE_URL}/api/query/history`, token);
  });
};

// Hook to fetch query history using SWR
export const useQueryHistory = () => {
  const { data } = useSWR("fetchQueryHistory", fetchQueryHistory, {
    revalidateOnFocus: false
  });
  return {
    getQueryHistory:
      data?.data?.map((entry: QueryHistoryEntry) => ({
        id: entry.id,
        query: entry.query,
        response: entry.response,
        timestamp: entry.timestamp,
        conversationId: entry.conversationId
      })) || []
  };
};

// Direct fetch method for query history
export const getQueryHistoryData = async () => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/api/query/history`;
    const response = await getData(url, token);
    return response.data;
  });
};

// Send a new query
export const sendQuery = async (query: string): Promise<QueryResponse> => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/api/query`;
    return postData(url, { query }, token);
  });
};

// Upload attendance file
export const uploadAttendance = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/api/attendance/upload`;
    return postData(url, formData, token);
  });
};

// Clear all query history
export const clearQueryHistory = async () => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/api/query/history`;
    return deleteData(url, token);
  });
};

// Delete a specific conversation
export const deleteConversation = async (conversationId: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/api/query/history/${conversationId}`;
    return deleteData(url, token);
  });
};
