import env from "@/app/common/env";
import { getData, postData, putData } from "@/app/common/utils/apiData";
import useSWR from "swr";
import { IOrganizationField } from "../interfaces/organizatioinInterface";
import { fetchToken } from "@/app/common/utils/authToken";

//fetch all users
const fetchOrganization = async () => {
  const token = fetchToken();
  if (!token) {
    return { error: "Please login again." };
  }
  return await getData(`${env.API_BASE_URL}/getAllOrganizations`, token);
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
  const token = fetchToken();
  if (!token) {
    return { error: "Please login again." };
  }
  const url = `${env.API_BASE_URL}/getAllOrganizations`;
  const response = await getData(url, token);
  return response.data;
};

//update a organization
export const updateOrganization = async (orgId: string, updatedFields: IOrganizationField) => {
  const token = fetchToken();
  if (!token) {
    return { error: "Please login again." };
  }
  const url = `${env.API_BASE_URL}/updateOrg/${orgId}`;
  return await putData(url, updatedFields as unknown as Record<string, unknown>, token);
};

//createOrganization
export const createOrganization = async (formData: IOrganizationField) => {
  const token = fetchToken();
  if (!token) {
    return { error: "Please login again." };
  }
  const url = `${env.API_BASE_URL}/createOrganization`;
  return await postData(url, formData as unknown as Record<string, unknown>, token);
};
