import env from "@/app/common/env";
import { getData, postData, deleteData } from "@/app/common/utils/apiData";
import useSWR from "swr";
import { withAuth } from "@/app/common/utils/authToken";
import { QueryHistoryEntry, QueryResponse } from "../interface/chatInterface";

// Fetch all query history or by conversationId
const fetchQueryHistory = async (conversationId?: string) => {
  return withAuth((token) => {
    const url = conversationId
      ? `${env.API_BASE_URL}/api/query/history/${conversationId}`
      : `${env.API_BASE_URL}/api/query/history`;
    return getData(url, token);
  });
};

// Hook to fetch query history using SWR
export const useQueryHistory = (conversationId?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    conversationId ? `queryHistory/${conversationId}` : "queryHistory",
    () => fetchQueryHistory(conversationId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: (err) => {
        console.error("SWR error:", err.message, err);
      }
    }
  );

  const history = Array.isArray(data?.data)
    ? data.data.map((entry: QueryHistoryEntry) => ({
        id: entry.id,
        query: entry.query,
        response: entry.response,
        timestamp: entry.timestamp,
        conversationId: entry.conversationId
      }))
    : [];

  return {
    history: history ?? [],
    isLoading,
    error: error ? new Error(error.message || "Failed to fetch history") : null,
    mutate
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

// Clear all query history
export const clearQueryHistory = async () => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/api/query/history`;
    return deleteData(url, token);
  });
};

// Delete a specific conversation
export const deleteConversation = async (conversationId: string) => {
  return await withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/api/query/conversation/${conversationId}`;
    return await deleteData(url, token);
  });
};
