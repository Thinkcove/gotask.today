import { getData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import useSWR from "swr";
import env from "@/app/common/env";
import { IAssetAttributes } from "../interface/asset";

//fetch all assets
export const fetchAllAssets = () =>
  withAuth((token) => getData(`${env.API_BASE_URL}/assets/getAll`, token));

export const useAllAssets = () => {
  const { data } = useSWR([`fetchallassets`], fetchAllAssets, {
    revalidateOnFocus: false
  });
  return {
    getAll: data?.data || []
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

//createTask
export const createLaptopAsset = (formData: IAssetAttributes) =>
  withAuth(async (token) => {
    const response = await fetch(`${env.API_BASE_URL}/createasset`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    if (!response.ok) throw new Error("Failed to create asset");
    return response.json();
  });
