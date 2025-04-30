// services/accessService.ts

import axios from "axios";
import { AccessOption, AccessRole } from "../interfaces/accessInterfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"; // Update as per your env

export const getAccessOptions = async (): Promise<{
  success: boolean;
  data?: AccessOption[];
  message?: string;
}> => {
  try {
    const response = await axios.get<AccessOption[]>(`${API_BASE_URL}/access/options`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch access options.",
    };
  }
};

export const createAccessRole = async (
  accessData: AccessRole
): Promise<{ success: boolean; data?: AccessRole; message?: string }> => {
  try {
    // Add the generic type <AccessRole> to the POST request
    const response = await axios.post<AccessRole>(
      `${API_BASE_URL}/access/create`,
      accessData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error creating access role:", error.response?.data || error.message);
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Failed to create access role.",
    };
  }
};


// GET all access roles
export const getAllAccessRoles = async (): Promise<{
  success: boolean;
  data?: AccessRole[];
  message?: string;
}> => {
  try {
    const response = await axios.get<AccessRole[]>(`${API_BASE_URL}/access`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};


// UPDATE access role by ID
export const updateAccessRole = async (
  id: string,
  accessData: Omit<AccessRole, 'id'> // don't require `id` in payload
): Promise<{ success: boolean; data?: AccessRole; message?: string }> => {
  try {
    // ✅ Remove _id from each application item before sending
    const cleanedApplication = accessData.application?.map(({ _id, ...rest }) => rest);

    const cleanedPayload = {
      name: accessData.name,
      application: cleanedApplication,
    };

    const response = await axios.put<AccessRole>(
      `${API_BASE_URL}/access/${id}`,
      cleanedPayload,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};



// DELETE access role by ID
export const deleteAccessRole = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    await axios.delete(`${API_BASE_URL}/access/${id}`);
    return { success: true, message: "Access role deleted successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const getAccessRoleById = async (
  id: string
): Promise<{ success: boolean; data?: AccessRole; message?: string }> => {
  try {
    const response = await axios.get<AccessRole>(`${API_BASE_URL}/access/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch access role by ID.",
    };
  }
};
