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

// Helper to remove restricted fields from an object
function removeRestrictedFields<T>(data: T, restrictedFields: string[]): Partial<T> {
  const cleanedData = { ...data } as Record<string, any>;
  restrictedFields.forEach((field) => {
    if (field in cleanedData) {
      delete cleanedData[field];
    }
  });
  return cleanedData as Partial<T>;
}

// Helper: Convert restrictedFields to plain object (identity function now)
const toRestrictedFieldsObject = (
  restrictedFields?: { [key: string]: string[] }
): { [key: string]: string[] } | undefined => {
  if (!restrictedFields) return undefined;
  return restrictedFields;
};

// Helper: Convert array of applications, ensure restrictedFields is plain object
const transformApplications = (
  applications?: Partial<IAccess["application"]>
): IAccess["application"] | undefined => {
  if (!applications) return undefined;

  return applications
    .filter((app): app is NonNullable<typeof app> => app !== undefined && app !== null)
    .map((app) => ({
      access: app.access!,
      actions: app.actions ?? [],
      restrictedFields: toRestrictedFieldsObject(app.restrictedFields as any),
    }));
};

// Create a new access record
const createAccess = async (
  accessData: Partial<IAccess>,
  restrictedFields: string[] = []
): Promise<{ success: boolean; data?: IAccess; message?: string }> => {
  try {
    // Remove restricted fields from input data if any
    const filteredData = removeRestrictedFields(accessData, restrictedFields);

    if (!filteredData.name || !filteredData.application) {
      return {
        success: false,
        message: AccessMessages.CREATE.REQUIRED
      };
    }

    // Transform application restrictedFields from plain object (identity now)
    filteredData.application = transformApplications(filteredData.application);

    const newAccess = await createAccessInDb(filteredData);

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
  updateData: Partial<IAccess>,
  restrictedFields: string[] = []
): Promise<{ success: boolean; data?: IAccess | null; message?: string }> => {
  try {
    const access = await getAccessByIdFromDb(id);
    if (!access) {
      return {
        success: false,
        message: AccessMessages.UPDATE.NOT_FOUND
      };
    }

    // Remove restricted fields from updateData
    const filteredUpdateData = removeRestrictedFields(updateData, restrictedFields);

    // Transform application restrictedFields from plain object
    if (filteredUpdateData.application) {
      filteredUpdateData.application = transformApplications(filteredUpdateData.application);
    }

    const updatedAccess = await updateAccessInDb(id, filteredUpdateData);

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
    const accessOptions = accessConfig.accesses || [];
    return { success: true, data: accessOptions };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to load access options" };
  }
};

export {
  createAccess,
  getAllAccesses,
  getAccessById,
  updateAccess,
  deleteAccessById,
  getAccessOptionsFromConfig
};
