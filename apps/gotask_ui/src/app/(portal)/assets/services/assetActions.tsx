import { getData, postData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import useSWR from "swr";
import env from "@/app/common/env";
import { IAssetAttributes, IAssetIssues, IAssetTags } from "../interface/asset";

//fetch all assets
export const fetchAllAssets = () =>
  withAuth((token) => getData(`${env.API_BASE_URL}/assets/getAll`, token));

export const useAllAssets = () => {
  const { data, mutate } = useSWR([`fetchallassets`], fetchAllAssets, {
    revalidateOnFocus: false
  });
  return {
    getAll: data?.data || [],
    mutate
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
