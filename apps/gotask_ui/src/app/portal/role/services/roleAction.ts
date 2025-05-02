import env from "@/app/common/env";
import { deleteData, getData, postData, putData } from "@/app/common/utils/apiData";
import useSWR from "swr";
import { IRole, Role } from "../interfaces/roleInterface";

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

//get all roles
export const getRoleData = async () => {
  const res = await fetch(`${env.API_BASE_URL}/roles`);
  if (!res.ok) throw new Error("Failed to fetch role");
  const result = await res.json();
  return result;
};

//get all access
const fetchAccess = async () => {
  return getData(`${env.API_BASE_URL}/access`);
};

export const fetchAllAccess = () => {
  const { data } = useSWR([`fetchaccess`], () => fetchAccess(), {
    revalidateOnFocus: false
  });
  return {
    getAllAccess:
      data?.map((user: { name: string; id: string }) => ({
        name: user.name,
        id: user.id
      })) || []
  };
};

//update a role
export const updateRole = async (roleId: string, updatedFields: Role) => {
  const url = `${env.API_BASE_URL}/roles/${roleId}`;
  return await putData(url, updatedFields as unknown as Record<string, unknown>);
};

//remove a access from a role
export const removeAccessFromRole = async (roleId: string, accessId: string) => {
  return await deleteData(`${env.API_BASE_URL}/roleAccess/${roleId}`, { accessId });
};

//createROle
export const createRole = async (formData: IRole) => {
  const url = `${env.API_BASE_URL}/roles`;
  return await postData(url, formData as unknown as Record<string, unknown>);
};
