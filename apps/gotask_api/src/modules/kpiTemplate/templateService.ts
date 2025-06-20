import { KpiTemplateMessages } from "../../constants/apiMessages/kpiMessages";
import {
  createKpiTemplateInDb,
  deleteKpiTemplateByIdFromDb,
  getAllKpiTemplatesFromDb,
  getKpiTemplateByIdFromDb,
  updateKpiTemplateInDb
} from "../../domain/interface/kpi/kpiInterface";
import { IKpiTemplate } from "../../domain/model/kpi/kpiModel";

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

// Create a new KPI template
const createKpiTemplate = async (
  templateData: Partial<IKpiTemplate>,
  restrictedFields: string[] = []
): Promise<{ success: boolean; data?: IKpiTemplate; message?: string }> => {
  try {
    const filteredData = removeRestrictedFields(templateData, restrictedFields);

    if (!filteredData.title || !filteredData.description || !filteredData.measurement_criteria) {
      return {
        success: false,
        message: KpiTemplateMessages.CREATE.REQUIRED
      };
    }

    const newTemplate = await createKpiTemplateInDb(filteredData);

    return {
      success: true,
      data: newTemplate
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || KpiTemplateMessages.CREATE.FAILED
    };
  }
};

// Get all KPI templates
const getAllKpiTemplates = async (): Promise<{
  success: boolean;
  data?: IKpiTemplate[] | null;
  message?: string;
}> => {
  try {
    const templates = await getAllKpiTemplatesFromDb();
    return {
      success: true,
      data: templates
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || KpiTemplateMessages.FETCH.FAILED_ALL
    };
  }
};

// Get a specific KPI template by template_id
const getKpiTemplateById = async (
  template_id: string
): Promise<{ success: boolean; data?: IKpiTemplate | null; message?: string }> => {
  try {
    const template = await getKpiTemplateByIdFromDb(template_id);
    if (!template) {
      return {
        success: false,
        message: KpiTemplateMessages.FETCH.NOT_FOUND
      };
    }
    return {
      success: true,
      data: template
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || KpiTemplateMessages.FETCH.FAILED_BY_ID
    };
  }
};

// Update KPI template by template_id
const updateKpiTemplate = async (
  template_id: string,
  updateData: Partial<IKpiTemplate>,
  restrictedFields: string[] = []
): Promise<{ success: boolean; data?: IKpiTemplate | null; message?: string }> => {
  try {
    const template = await getKpiTemplateByIdFromDb(template_id);
    if (!template) {
      return {
        success: false,
        message: KpiTemplateMessages.UPDATE.NOT_FOUND
      };
    }

    const filteredUpdateData = removeRestrictedFields(updateData, restrictedFields);

    const updatedTemplate = await updateKpiTemplateInDb(template_id, filteredUpdateData);

    return {
      success: true,
      data: updatedTemplate
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || KpiTemplateMessages.UPDATE.FAILED
    };
  }
};

// Delete KPI template by template_id
const deleteKpiTemplateById = async (
  template_id: string
): Promise<{ success: boolean; data?: IKpiTemplate | null; message?: string }> => {
  try {
    const template = await getKpiTemplateByIdFromDb(template_id);
    if (!template) {
      return {
        success: false,
        message: KpiTemplateMessages.DELETE.NOT_FOUND
      };
    }

    const success = await deleteKpiTemplateByIdFromDb(template_id);

    if (!success) {
      return {
        success: false,
        message: KpiTemplateMessages.DELETE.FAILED
      };
    }
    return {
      success: true,
      message: KpiTemplateMessages.DELETE.SUCCESS
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || KpiTemplateMessages.DELETE.FAILED
    };
  }
};

export {
  createKpiTemplate,
  getAllKpiTemplates,
  getKpiTemplateById,
  updateKpiTemplate,
  deleteKpiTemplateById
};
