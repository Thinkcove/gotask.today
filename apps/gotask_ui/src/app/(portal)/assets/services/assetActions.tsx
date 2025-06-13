import { getData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import useSWR from "swr";
import env from "@/app/common/env";

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
