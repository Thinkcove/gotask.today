import env from "@/app/common/env";
import { getData, postData, putData } from "@/app/common/utils/apiData";
import useSWR from "swr";
import { IOrganizationField } from "../interfaces/organizatioinInterface";

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

//get all organization
export const getOrganizationData = async () => {
  const res = await fetch(`${env.API_BASE_URL}/getAllOrganizations`);
  if (!res.ok) throw new Error("Failed to fetch organizations");
  const result = await res.json();
  return result.data;
};

//update a organization
export const updateOrganization = async (orgId: string, updatedFields: IOrganizationField) => {
  const url = `${env.API_BASE_URL}/updateOrg/${orgId}`;
  return await putData(url, updatedFields as unknown as Record<string, unknown>);
};

//createOrganization
export const createOrganization = async (formData: IOrganizationField) => {
  const url = `${env.API_BASE_URL}/createOrganization`;
  return await postData(url, formData as unknown as Record<string, unknown>);
};
