import env from "@/app/common/env";
import { getData } from "@/app/common/utils/apiData";
import useSWR from "swr";

//fetch all users
const fetchRole = async () => {
  return getData(`${env.API_BASE_URL}/roles`);
};

export const fetchAllRoles = () => {
  const { data } = useSWR([`fetchrole`], () => fetchRole(), {
    revalidateOnFocus: false
  });
  return {
    getRoles:
      data?.map((user: { name: string; _id: string }) => ({
        name: user.name,
        id: user._id
      })) || []
  };
};
