import env from "@/app/common/env";
import { getData, postData, putData, deleteData } from "@/app/common/utils/apiData";
import useSWR from "swr";
import { withAuth } from "@/app/common/utils/authToken";
import { AccessOption, AccessRole } from "../interfaces/accessInterfaces";

// Interface for AccessData
interface AccessData {
  id: string;
  name: string;
  accesses: { access: string; actions: string[] }[];
  createdAt?: string;
}

// Fetch access options
export const getAccessOptions = async (): Promise<{
  success: boolean;
  data?: AccessOption[];
  message?: string;
}> => {
  const result = await withAuth(async (token) => {
    const data = await getData(`${env.API_BASE_URL}/access/options`, token);
    return { success: true, data };
  });

  if ("error" in result) {
    return { success: false, message: result.error };
  }

  return result;
};

// SWR hook for access options
const fetchAccessOptions = async () => {
  const result = await withAuth(async (token) => {
    return await getData(`${env.API_BASE_URL}/access/options`, token);
  });

  if ("error" in result) {
    return [];
  }

  return result;
};

export const useAccessOptions = () => {
  const { data, error, isLoading } = useSWR([`fetchAccessOptions`], fetchAccessOptions, {
    revalidateOnFocus: false
  });

  return {
    accessOptions: Array.isArray(data) ? data : [],
    isLoading,
    error: error ? error.message : null
  };
};

// Create an access role
export const createAccessRole = async (
  accessData: AccessRole
): Promise<{ success: boolean; data?: AccessRole; message?: string }> => {
  const result = await withAuth(async (token) => {
    const data = await postData(
      `${env.API_BASE_URL}/access/create`,
      accessData as unknown as Record<string, unknown>,
      token
    );
    return { success: true, data };
  });

  if ("error" in result) {
    return { success: false, message: result.error };
  }

  return result;
};

// Fetch all access roles
const fetchAccessRoles = async () => {
  const result = await withAuth(async (token) => {
    return await getData(`${env.API_BASE_URL}/access`, token);
  });

  if ("error" in result) {
    return [];
  }

  return result;
};

export const useAllAccessRoles = () => {
  const { data, error, isLoading } = useSWR([`fetchAccessRoles`], fetchAccessRoles, {
    revalidateOnFocus: false
  });

  const mappedData: AccessData[] =
    data?.map((role: AccessRole) => ({
      id: role.id,
      name: role.name,
      accesses: role.application || [],
      createdAt: role.createdAt
    })) || [];

  return {
    accessRoles: mappedData,
    isLoading,
    error: error ? error.message : null
  };
};

// Update an access role
export const updateAccessRole = async (
  id: string,
  accessData: Omit<AccessRole, "id">
): Promise<{ success: boolean; data?: AccessRole; message?: string }> => {
  const result = await withAuth(async (token) => {
    const cleanedPayload = {
      name: accessData.name,
      application: accessData.application?.map(({ ...rest }) => rest)
    };

    const data = await putData(
      `${env.API_BASE_URL}/access/${id}`,
      cleanedPayload as unknown as Record<string, unknown>,
      token
    );
    return { success: true, data };
  });

  if ("error" in result) {
    return { success: false, message: result.error };
  }

  return result;
};

// Delete an access role
export const deleteAccessRole = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const result = await withAuth(async (token) => {
    await deleteData(`${env.API_BASE_URL}/access/${id}`, token);
    return { success: true, message: "Access role deleted successfully." };
  });

  if ("error" in result) {
    return { success: false, message: result.error };
  }

  return result;
};

// Fetch access role by ID
export const getAccessRoleById = async (
  id: string
): Promise<{ success: boolean; data?: AccessRole; message?: string }> => {
  const result = await withAuth(async (token) => {
    const data = await getData(`${env.API_BASE_URL}/access/${id}`, token);
    return { success: true, data };
  });

  if ("error" in result) {
    return { success: false, message: result.error };
  }

  return result;
};

// SWR hook for access role by ID
const fetchAccessRoleById = async ([, id]: [string, string]) => {
  const result = await withAuth(async (token) => {
    return await getData(`${env.API_BASE_URL}/access/${id}`, token);
  });

  if ("error" in result) {
    return null;
  }

  return result;
};

export const useAccessRoleById = (id: string) => {
  const { data, error, isLoading } = useSWR([`fetchAccessRoleById`, id], fetchAccessRoleById, {
    revalidateOnFocus: false
  });

  return {
    role: data,
    isLoading,
    error: error ? error.message : null
  };
};
