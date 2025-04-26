import env from "@/app/common/env";
import { getData } from "@/app/common/utils/apiData";
import useSWR from "swr";

//fetch all users
const fetchOrganization = async () => {
  return getData(`${env.API_BASE_URL}/getAllOrganizations`);
};

export const fetchAllOrganizations = () => {
  const { data } = useSWR([`fetchorganization`], () => fetchOrganization(), {
    revalidateOnFocus: false
  });
  return {
    getOrganizations:
      data?.data?.map((user: { name: string; id: string }) => ({
        name: user.name,
        id: user.id
      })) || []
  };
};

// services/organizationAction.ts
export const getOrganizationData = async () => {
  const res = await fetch(`${env.API_BASE_URL}/getAllOrganizations`);
  if (!res.ok) throw new Error("Failed to fetch organizations");

  const result = await res.json();
  return result.data; // <- this is the actual array of organizations
};
