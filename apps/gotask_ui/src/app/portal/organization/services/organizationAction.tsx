import env from "@/app/common/env";
import { getData, postData, putData } from "@/app/common/utils/apiData";
import useSWR from "swr";
import { IOrganizationField } from "../interfaces/organizatioinInterface";
import { withAuth } from "@/app/common/utils/authToken";

// Fetch all organizations
const fetchOrganization = async () => {
  return withAuth((token) => {
    return getData(`${env.API_BASE_URL}/getAllOrganizations`, token);
  });
};

// Hook using SWR
export const fetchAllOrganizations = () => {
  const { data } = useSWR([`fetchorganization`], fetchOrganization, {
    revalidateOnFocus: false
  });
  return {
    getOrganizations:
      data?.data?.map((org: { name: string; id: string }) => ({
        name: org.name,
        id: org.id
      })) || []
  };
};

// Direct fetch method
export const getOrganizationData = async () => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/getAllOrganizations`;
    const response = await getData(url, token);
    return response.data;
  });
};

// Update an organization
export const updateOrganization = async (orgId: string, updatedFields: IOrganizationField) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/updateOrg/${orgId}`;
    return putData(url, updatedFields as unknown as Record<string, unknown>, token);
  });
};

// Create organization
export const createOrganization = async (formData: IOrganizationField) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/createOrganization`;
    return postData(url, formData as unknown as Record<string, unknown>, token);
  });
};
