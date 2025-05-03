import { IAccess } from "../../domain/model/access/access";
import {
  createAccessInDb,
  getAllAccessRecordsFromDb,
  getAccessByIdFromDb,
  updateAccessInDb,
  deleteAccessByIdFromDb
} from "../../domain/interface/access/accessInterface";
import AccessMessages from "../../constants/apiMessages/accessMessage";
import accessConfig from "../../modules/access/accessConfig.json";

// Create a new access record
const createAccess = async (
  accessData: Partial<IAccess>
): Promise<{ success: boolean; data?: IAccess; message?: string }> => {
  try {
    if (!accessData.name || !accessData.application) {
      return {
        success: false,
        message: AccessMessages.CREATE.REQUIRED
      };
    }

    const newAccess = await createAccessInDb(accessData);

    return {
      success: true,
      data: newAccess
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || AccessMessages.CREATE.FAILED
    };
  }
};

// Get all access records
const getAllAccesses = async (): Promise<{
  success: boolean;
  data?: IAccess[] | null;
  message?: string;
}> => {
  try {
    const accesses = await getAllAccessRecordsFromDb();
    return {
      success: true,
      data: accesses
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || AccessMessages.FETCH.FAILED_ALL
    };
  }
};

// Get a specific access by ID
const getAccessById = async (
  id: string
): Promise<{ success: boolean; data?: IAccess | null; message?: string }> => {
  try {
    const access = await getAccessByIdFromDb(id);
    if (!access) {
      return {
        success: false,
        message: AccessMessages.FETCH.NOT_FOUND
      };
    }
    return {
      success: true,
      data: access
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || AccessMessages.FETCH.FAILED_BY_ID
    };
  }
};


// Update access record by unique ID
const updateAccess = async (
  id: string,
  updateData: Partial<IAccess>
): Promise<{ success: boolean; data?: IAccess | null; message?: string }> => {
  try {
    const access = await getAccessByIdFromDb(id);
    if (!access) {
      return {
        success: false,
        message: AccessMessages.UPDATE.NOT_FOUND
      };
    }

    const updatedAccess = await updateAccessInDb(id, updateData);

    return {
      success: true,
      data: updatedAccess
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || AccessMessages.UPDATE.FAILED
    };
  }
};

// Delete access record by unique ID
const deleteAccessById = async (
  id: string
): Promise<{ success: boolean; data?: IAccess | null; message?: string }> => {
  try {
    const access = await getAccessByIdFromDb(id);
    if (!access) {
      return {
        success: false,
        message: AccessMessages.DELETE.NOT_FOUND
      };
    }

    const success = await deleteAccessByIdFromDb(id);

    if (!success) {
      return {
        success: false,
        message: AccessMessages.DELETE.FAILED
      };
    }
    return {
      success: true,
      message: AccessMessages.DELETE.SUCCESS
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || AccessMessages.DELETE.FAILED
    };
  }
};

const getAccessOptionsFromConfig = async () => {
  try {
    // Assuming `accessConfig.json` contains an array of access modules and actions
    const accessOptions = accessConfig.accesses || [];
    return { success: true, data: accessOptions };
  } catch (error) {
    return  { success: false, message: AccessMessages.CONFIG.LOAD_FAILED };
  }
};

// Export functions as named exports
// Export functions as named exports
export { createAccess, getAllAccesses, getAccessById, updateAccess, deleteAccessById, getAccessOptionsFromConfig };
