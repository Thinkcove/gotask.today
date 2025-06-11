
import env from "@/app/common/env";
import { getData, postData, putData, deleteData } from "@/app/common/utils/apiData";
import useSWR from "swr";
import { withAuth } from "@/app/common/utils/authToken";
import { AccessOption, AccessRole } from "../interfaces/accessInterfaces";

interface AccessData {
  id: string;
  name: string;
  application: {
    access: string;
    actions: string[];
    restrictedFields?: { [key: string]: string[] };
  }[];
  createdAt?: string;
}

// Helper to safely check for "error" key
const isErrorResult = (result: any): result is { error: string } =>
  result && typeof result === "object" && "error" in result;

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

  if (!result || isErrorResult(result)) {
    return { success: false, message: result?.error || "Failed to fetch access options" };
  }

  return result;
};

// SWR hook for access options
const fetchAccessOptions = async () => {
  const result = await withAuth(async (token) => {
    return await getData(`${env.API_BASE_URL}/access/options`, token);
  });

  if (!result || isErrorResult(result)) {
    return [];
  }

  return result;
};

export const useAccessOptions = () => {
  const { data, error, isLoading } = useSWR([`fetchAccessOptions`], fetchAccessOptions, {
    revalidateOnFocus: false,
  });

  return {
    accessOptions: Array.isArray(data) ? data : [],
    isLoading,
    error: error ? error.message : null,
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

  if (!result || isErrorResult(result)) {
    return { success: false, message: result?.error || "Failed to create access role" };
  }

  return result;
};

// Fetch all access roles
const fetchAccessRoles = async () => {
  const result = await withAuth(async (token) => {
    return await getData(`${env.API_BASE_URL}/access`, token);
  });

  if (!result || isErrorResult(result)) {
    return [];
  }

  return result;
};

export const useAllAccessRoles = () => {
  const { data, error, isLoading } = useSWR([`fetchAccessRoles`], fetchAccessRoles, {
    revalidateOnFocus: false,
  });

  const mappedData: AccessData[] =
    data?.map((role: AccessRole) => ({
      id: role.id,
      name: role.name,
      application: role.application || [],
      createdAt: role.createdAt,
    })) || [];

  return {
    accessRoles: mappedData,
    isLoading,
    error: error ? error.message : null,
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
      application: accessData.application?.map(({ access, actions, restrictedFields }) => ({
        access,
        actions,
        restrictedFields,
      })),
    };

    const data = await putData(
      `${env.API_BASE_URL}/access/${id}`,
      cleanedPayload as unknown as Record<string, unknown>,
      token
    );
    return { success: true, data };
  });

  if (!result || isErrorResult(result)) {
    return { success: false, message: result?.error || "Failed to update access role" };
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

  if (!result || isErrorResult(result)) {
    return { success: false, message: result?.error || "Failed to delete access role" };
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

  if (!result || isErrorResult(result)) {
    return { success: false, message: result?.error || "Failed to fetch access role" };
  }

  return result;
};

// SWR hook for access role by ID
const fetchAccessRoleById = async ([, id]: [string, string]) => {
  const result = await withAuth(async (token) => {
    return await getData(`${env.API_BASE_URL}/access/${id}`, token);
  });

  if (!result || isErrorResult(result)) {
    return null;
  }

  return result;
};

export const useAccessRoleById = (id: string) => {
  const { data, error, isLoading } = useSWR([`fetchAccessRoleById`, id], fetchAccessRoleById, {
    revalidateOnFocus: false,
  });

  return {
    role: data,
    isLoading,
    error: error ? error.message : null,
  };
};