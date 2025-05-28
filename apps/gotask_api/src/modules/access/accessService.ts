import { IAccess } from "../../domain/model/access/access";
import {
  createAccessInDb,
  getAllAccessRecordsFromDb,
  getAccessByIdFromDb,
  updateAccessInDb,
  deleteAccessByIdFromDb,
} from "../../domain/interface/access/accessInterface";
import AccessMessages from "../../constants/apiMessages/accessMessage";
import accessConfig from "./accessConfig.json";

// Utility: Filter object keys based on allowed fields
const filterFields = <T extends object>(
  obj: T | null | undefined,
  allowedFields: (keyof T)[]
): Partial<T> => {
  if (!obj || typeof obj !== "object") return {};
  const filtered: Partial<T> = {};
  allowedFields.forEach((field) => {
    if (field in obj) filtered[field] = obj[field];
  });
  return filtered;
};

// Fields allowed in Access document
const allowedAccessFields: (keyof IAccess)[] = ["name", "application"];

// Create Access service
const createAccess = async (
  accessData: Partial<IAccess>
): Promise<{ success: boolean; data?: Partial<IAccess>; message?: string }> => {
  try {
    const filteredInput = filterFields(accessData, allowedAccessFields);

    if (!filteredInput.name || !filteredInput.application) {
      return {
        success: false,
        message: AccessMessages.CREATE.REQUIRED,
      };
    }

    // TODO: Add validation for application structure if needed

    const newAccess = await createAccessInDb(filteredInput);
    const filteredAccess = filterFields(newAccess, ["id", ...allowedAccessFields]);

    return {
      success: true,
      data: filteredAccess,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || AccessMessages.CREATE.FAILED,
    };
  }
};

// Update Access service
const updateAccess = async (
  id: string,
  updateData: Partial<IAccess>
): Promise<{ success: boolean; data?: Partial<IAccess>; message?: string }> => {
  try {
    const existing = await getAccessByIdFromDb(id);
    if (!existing) {
      return {
        success: false,
        message: AccessMessages.UPDATE.NOT_FOUND,
      };
    }

    const filteredUpdate = filterFields(updateData, allowedAccessFields);

    // TODO: Add validation for application/actions format if needed

    const updatedAccess = await updateAccessInDb(id, filteredUpdate);
    const filtered = filterFields(updatedAccess!, ["id", ...allowedAccessFields]);

    return {
      success: true,
      data: filtered,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || AccessMessages.UPDATE.FAILED,
    };
  }
};

// Get all Access records service
const getAllAccesses = async (): Promise<{
  success: boolean;
  data?: Partial<IAccess>[];
  message?: string;
}> => {
  try {
    const accesses = await getAllAccessRecordsFromDb();
    const filteredAccesses = accesses.map((access) =>
      filterFields(access, ["id", ...allowedAccessFields])
    );

    return {
      success: true,
      data: filteredAccesses,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || AccessMessages.FETCH.FAILED_ALL,
    };
  }
};

// Get Access by ID service
const getAccessById = async (
  id: string
): Promise<{ success: boolean; data?: Partial<IAccess>; message?: string }> => {
  try {
    const access = await getAccessByIdFromDb(id);
    if (!access) {
      return {
        success: false,
        message: AccessMessages.FETCH.NOT_FOUND,
      };
    }

    const filtered = filterFields(access, ["id", ...allowedAccessFields]);

    return {
      success: true,
      data: filtered,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || AccessMessages.FETCH.FAILED_BY_ID,
    };
  }
};

// Delete Access by ID service
const deleteAccessById = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const access = await getAccessByIdFromDb(id);
    if (!access) {
      return {
        success: false,
        message: AccessMessages.DELETE.NOT_FOUND,
      };
    }

    const success = await deleteAccessByIdFromDb(id);
    if (!success) {
      return {
        success: false,
        message: AccessMessages.DELETE.FAILED,
      };
    }

    return {
      success: true,
      message: AccessMessages.DELETE.SUCCESS,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || AccessMessages.DELETE.FAILED,
    };
  }
};

// Get Access options from config file
const getAccessOptionsFromConfig = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const accessOptions = accessConfig.accesses || [];
    return { success: true, data: accessOptions };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || AccessMessages.CONFIG.LOAD_FAILED,
    };
  }
};

export {
  createAccess,
  getAllAccesses,
  getAccessById,
  updateAccess,
  deleteAccessById,
  getAccessOptionsFromConfig,
  getAllAccessRecordsFromDb,
};
