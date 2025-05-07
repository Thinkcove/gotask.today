import env from "@/app/common/env";
import { getData, postData, putData, deleteData } from "@/app/common/utils/apiData";
import useSWR from "swr";
import { fetchToken } from "@/app/common/utils/authToken";
import { AccessOption, AccessRole } from "../interfaces/accessInterfaces";

// Interface for AccessData to ensure mapping compatibility
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
  const token = fetchToken();
  if (!token) {
    return { success: false, message: "Please login again." };
  }
  try {
    const data = await getData(`${env.API_BASE_URL}/access/options`, token);
    console.log("getAccessOptions data:", data); // Debug log
    return { success: true, data };
  } catch (error: any) {
    console.error("getAccessOptions error:", error.response || error.message);
    return {
      success: false,
      message: error.response?.message || error.message || "Failed to fetch access options."
    };
  }
};

// SWR hook for access options
const fetchAccessOptions = async () => {
  const token = fetchToken();
  if (!token) {
    throw new Error("Please login again.");
  }
  const data = await getData(`${env.API_BASE_URL}/access/options`, token);
  console.log("fetchAccessOptions data:", data); // Debug log
  return data;
};

export const useAccessOptions = () => {
  const { data, error, isLoading } = useSWR([`fetchAccessOptions`], fetchAccessOptions, {
    revalidateOnFocus: false
  });

  console.log("useAccessOptions data:", data); // Debug log

  return {
    accessOptions: Array.isArray(data) ? data : [],
    isLoading,
    error: error ? error.message || "Failed to fetch access options" : null
  };
};

// Create an access role
export const createAccessRole = async (
  accessData: AccessRole
): Promise<{ success: boolean; data?: AccessRole; message?: string }> => {
  const token = fetchToken();
  if (!token) {
    return { success: false, message: "Please login again." };
  }
  try {
    const data = await postData(
      `${env.API_BASE_URL}/access/create`,
      accessData as unknown as Record<string, unknown>,
      token
    );
    console.log("createAccessRole data:", data); // Debug log
    return { success: true, data };
  } catch (error: any) {
    console.error("createAccessRole error:", error.response || error.message);
    return {
      success: false,
      message: error.response?.message || error.message || "Failed to create access role."
    };
  }
};

// Fetch all access roles with SWR
const fetchAccessRoles = async () => {
  const token = fetchToken();
  if (!token) {
    throw new Error("Please login again.");
  }
  const data = await getData(`${env.API_BASE_URL}/access`, token);
  console.log("fetchAccessRoles data:", data); // Debug log
  return data;
};

export const fetchAllAccessRoles = () => {
  const { data, error, isLoading } = useSWR([`fetchAccessRoles`], fetchAccessRoles, {
    revalidateOnFocus: false
  });

  const mappedData: AccessData[] =
    data?.map((role: AccessRole) => ({
      id: role.id,
      name: role.name,
      accesses: role.application || [], // Map application to accesses
      createdAt: role.createdAt
    })) || [];

  console.log("fetchAllAccessRoles mappedData:", mappedData); // Debug log

  return {
    accessRoles: mappedData,
    isLoading,
    error: error ? error.message || "Failed to fetch access roles" : null
  };
};

// Update an access role
export const updateAccessRole = async (
  id: string,
  accessData: Omit<AccessRole, "id">
): Promise<{ success: boolean; data?: AccessRole; message?: string }> => {
  const token = fetchToken();
  if (!token) {
    return { success: false, message: "Please login again." };
  }
  try {
    const cleanedApplication = accessData.application?.map(({ ...rest }) => rest);
    const cleanedPayload = {
      name: accessData.name,
      application: cleanedApplication
    };
    const data = await putData(
      `${env.API_BASE_URL}/access/${id}`,
      cleanedPayload as unknown as Record<string, unknown>,
      token
    );
    console.log("updateAccessRole data:", data); // Debug log
    return { success: true, data };
  } catch (error: any) {
    console.error("updateAccessRole error:", error.response || error.message);
    return {
      success: false,
      message: error.response?.message || error.message || "Failed to update access role."
    };
  }
};

// Delete an access role
export const deleteAccessRole = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const token = fetchToken();
  if (!token) {
    return { success: false, message: "Please login again." };
  }
  try {
    await deleteData(`${env.API_BASE_URL}/access/${id}`, token);
    console.log("deleteAccessRole success for id:", id); // Debug log
    return { success: true, message: "Access role deleted successfully." };
  } catch (error: any) {
    console.error("deleteAccessRole error:", error.response || error.message);
    return {
      success: false,
      message: error.response?.message || error.message || "Failed to delete access role."
    };
  }
};

// Fetch access role by ID
export const getAccessRoleById = async (
  id: string
): Promise<{ success: boolean; data?: AccessRole; message?: string }> => {
  const token = fetchToken();
  if (!token) {
    return { success: false, message: "Please login again." };
  }
  try {
    const data = await getData(`${env.API_BASE_URL}/access/${id}`, token);
    console.log("getAccessRoleById data:", data); // Debug log
    return { success: true, data };
  } catch (error: any) {
    console.error("getAccessRoleById error:", error.response || error.message);
    return {
      success: false,
      message: error.response?.message || error.message || "Failed to fetch access role by ID."
    };
  }
};

// SWR hook for access role by ID
const fetchAccessRoleById = async ([_, id]: [string, string]) => {
  const token = fetchToken();
  if (!token) {
    throw new Error("Please login again.");
  }
  const data = await getData(`${env.API_BASE_URL}/access/${id}`, token);
  console.log("fetchAccessRoleById data:", data); // Debug log
  return data;
};

export const useAccessRoleById = (id: string) => {
  const { data, error, isLoading } = useSWR([`fetchAccessRoleById`, id], fetchAccessRoleById, {
    revalidateOnFocus: false
  });

  console.log("useAccessRoleById data:", data); // Debug log

  return {
    role: data,
    isLoading,
    error: error ? error.message || "Failed to fetch access role" : null
  };
};
