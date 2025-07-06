import { getData, postData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import useSWR from "swr";
import env from "@/app/common/env";
import { IAssetAttributes, IAssetIssues, IAssetTags } from "../interface/asset";
import { CREATED_AT, DESC } from "../assetConstants";

//fetch all assets
export const fetchAllAssets = (sortVar = CREATED_AT, sortType = DESC) =>
  withAuth((token) =>
    postData(`${env.API_BASE_URL}/assets/getAll`, { sort_var: sortVar, sort_type: sortType }, token)
  );

export const useAllAssets = (sortVar = CREATED_AT, sortType = DESC) => {
  const { data, mutate, isLoading } = useSWR(
    [`fetchallassets`, sortVar, sortType],
    () => fetchAllAssets(sortVar, sortType),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  return {
    getAll: data?.data || [],
    mutate,
    isLoading
  };
};

//fetch all assets
export const fetchAllTypes = () =>
  withAuth((token) => getData(`${env.API_BASE_URL}/getAllType`, token));

export const useAllTypes = () => {
  const { data } = useSWR([`fetchalltypes`], fetchAllTypes, {
    revalidateOnFocus: false
  });
  return {
    getAll: data?.data || []
  };
};

export const createAssetAttributes = async (formData: IAssetAttributes) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/createasset`;
    return postData(url, formData as unknown as Record<string, unknown>, token);
  });
};

export const createAssetTags = async (formData: IAssetTags) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/createresource`;
    return postData(url, formData as unknown as Record<string, unknown>, token);
  });
};

//fetch all assets tags
export const fetchAllTags = () =>
  withAuth((token) => getData(`${env.API_BASE_URL}/getAllTags`, token));

export const useAllTags = () => {
  const { data, mutate } = useSWR([`fetchalltags`], fetchAllTags, {
    revalidateOnFocus: false
  });
  return {
    getAll: data?.data || [],
    mutate
  };
};

export const createAssetIssues = async (formData: IAssetIssues) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/createissues`;
    return postData(url, formData as unknown as Record<string, unknown>, token);
  });
};

export const fetchAllIssues = () =>
  withAuth((token) => getData(`${env.API_BASE_URL}/getallissues`, token));

export const useAllIssues = () => {
  const { data, mutate } = useSWR([`fetchallissues`], fetchAllIssues, {
    revalidateOnFocus: false
  });
  return {
    getAll: data?.data || [],
    mutate
  };
};

const isErrorResult = (result: any): result is { error: string } =>
  result && typeof result === "object" && "error" in result;

const getTagById = async ([, id]: [string, string]): Promise<IAssetTags | null> => {
  const result = await withAuth(async (token) => {
    return await getData(`${env.API_BASE_URL}/gettagbyid/${id}`, token);
  });

  if (!result || isErrorResult(result)) {
    return null;
  }

  return result.data;
};

export const useTagById = (id: string) => {
  const { data, error, isLoading } = useSWR([`fetchTagById`, id], getTagById, {
    revalidateOnFocus: false
  });

  return {
    tags: data ?? null,
    isLoading,
    error: error ? error.message : null
  };
};

const getAssetById = async ([, id]: [string, string]): Promise<IAssetAttributes | null> => {
  const result = await withAuth(async (token) => {
    return await getData(`${env.API_BASE_URL}/asset/${id}`, token);
  });

  if (!result || isErrorResult(result)) {
    return null;
  }

  return result.data;
};

export const useAssetById = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR([`fetchAssetById`, id], getAssetById, {
    revalidateOnFocus: false
  });

  return {
    asset: data ?? null,
    isLoading,
    mutate,
    error: error ? error.message : null
  };
};

const getIssuesById = async ([, id]: [string, string]): Promise<IAssetIssues | null> => {
  const result = await withAuth(async (token) => {
    return await getData(`${env.API_BASE_URL}/getissuesbyid/${id}`, token);
  });

  if (!result || isErrorResult(result)) {
    return null;
  }

  return result.data;
};

export const useIssuesById = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR([`fetchIssuesById`, id], getIssuesById, {
    revalidateOnFocus: false
  });

  return {
    asset: data ?? null,
    isLoading,
    mutate,
    error: error ? error.message : null
  };
};

const getUserByAssetId = async ([, id]: [string, string]): Promise<IAssetTags | null> => {
  const result = await withAuth(async (token) => {
    return await getData(`${env.API_BASE_URL}/getuserbyassetid/${id}`, token);
  });

  if (!result || isErrorResult(result)) {
    return null;
  }

  return result.data;
};

export const useUserByAssetId = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR([`fetchUserByAssetId`, id], getUserByAssetId, {
    revalidateOnFocus: false
  });

  return {
    asset: data ?? null,
    isLoading,
    mutate,
    error: error ? error.message : null
  };
};

export const deleteAsset = async (id: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/asset/delete/${id}`;
    return postData(url, {}, token);
  });
};
