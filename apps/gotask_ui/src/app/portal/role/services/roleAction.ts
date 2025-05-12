import env from "@/app/common/env";
import { deleteData, getData, postData, putData } from "@/app/common/utils/apiData";
import useSWR from "swr";
import { IRole, Role } from "../interfaces/roleInterface";
import { withAuth } from "@/app/common/utils/authToken";

// Create Role
export const createRole = async (formData: IRole) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/roles`;
    return postData(url, formData as unknown as Record<string, unknown>, token);
  });
};

// Update Role
export const updateRole = async (roleId: string, updatedFields: Role) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/roles/${roleId}`;
    return putData(url, updatedFields as unknown as Record<string, unknown>, token);
  });
};

// Get All Roles
export const getRoleData = async () => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/roles`;
    return getData(url, token);
  });
};

// Fetch Roles (for dropdowns or simplified lists)
const fetchRole = async () => {
  return withAuth((token) => getData(`${env.API_BASE_URL}/roles`, token));
};

export const useAllRoles = () => {
  const { data } = useSWR([`fetchrole`], fetchRole, {
    revalidateOnFocus: false
  });
  return {
    getRoles:
      data?.map((role: { name: string; _id: string }) => ({
        name: role.name,
        id: role._id
      })) || []
  };
};

// Fetch Access
const fetchAccess = async () => {
  return withAuth((token) => getData(`${env.API_BASE_URL}/access`, token));
};

export const useAllAccess = () => {
  const { data } = useSWR([`fetchaccess`], fetchAccess, {
    revalidateOnFocus: false
  });
  return {
    getAllAccess:
      data?.map((access: { name: string; id: string }) => ({
        name: access.name,
        id: access.id
      })) || []
  };
};

// Remove Access from Role
export const removeAccessFromRole = async (roleId: string, accessId: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/roleAccess/${roleId}`;
    return deleteData(url, token, { accessId });
  });
};
