import env from "@/app/common/env";
import { postData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import useSWR from "swr";

export interface UserPreference {
  module_name: string;
  exclude_fields: string[];
}

export interface SetPreferencePayload {
  user_id: string;
  preferences: UserPreference[];
}

interface GetPreferencePayload {
  user_id: string;
}

export const setUserPreferences = async (payload: SetPreferencePayload) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/setPreference`; // or hardcode if needed
    return postData(url, payload as unknown as Record<string, unknown>, token);
  });
};

export const getPreference = async (payload: GetPreferencePayload) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/getPreference`;
    return postData(url, payload as unknown as Record<string, unknown>, token);
  });
};

export const useUserPreferences = (userId: string) => {
  const { data, error, isLoading } = useSWR(userId ? ["preferences", userId] : null, () =>
    getPreference({ user_id: userId })
  );

  return {
    preferences: data?.preferences || [],
    isLoading,
    isError: !!error
  };
};

export const getExcludedFields = (
  preferences: { module_name: string; exclude_fields: string[] }[] = [],
  moduleName: string
): string[] => {
  const pref = preferences.find((p) => p.module_name === moduleName);
  return pref?.exclude_fields || [];
};
