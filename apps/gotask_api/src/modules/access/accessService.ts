// accessService.ts

import { IAccess, Access } from "../../domain/model/access";
import AccessMessages from "../../constants/apiMessages/accessMeggage"; // Fixing typo here from 'accessMeggage' to 'accessMessage'

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

    const newAccess = await new Access({
      name: accessData.name,
      application: accessData.application,
    }).save();

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
  data?: IAccess[];
  message?: string;
}> => {
  try {
    const accesses = await Access.find();
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
    const access = await Access.findOne({ id });
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

// Update access record by ID
const updateAccess = async (
  id: string,
  updateData: Partial<IAccess>
): Promise<{ success: boolean; data?: IAccess | null; message?: string }> => {
  try {
    const updatedAccess = await Access.findOneAndUpdate({ id }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAccess) {
      return {
        success: false,
        message: AccessMessages.UPDATE.NOT_FOUND
      };
    }
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

// Delete access record by ID
const deleteAccessById = async (
  id: string
): Promise<{ success: boolean; data?: IAccess | null; message?: string }> => {
  try {
    const deletedAccess = await Access.findOneAndDelete({ id });
    if (!deletedAccess) {
      return {
        success: false,
        message: AccessMessages.DELETE.NOT_FOUND
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

// Export functions as named exports
export { createAccess, getAllAccesses, getAccessById, updateAccess, deleteAccessById };
