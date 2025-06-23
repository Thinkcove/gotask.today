import env from "@/app/common/env";
import { Template } from "./templateInterface";
import { getData, postData, putData, deleteData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";

export const createTemplate = async (template: Partial<Template>) => {
  try {
    const response = await withAuth(async (token) => {
      const url = `${env.API_BASE_URL}/kpi/template`;
      const payload = {
        title: template.name,
        description: template.description,
        measurement_criteria: template.weightage,
        frequency: template.frequency,
        status: template.status
      };

      const response = await postData(url, payload, token);
      const data = response.data || response;
      if (!data.template_id) {
        throw new Error("Missing template_id in response");
      }
      return {
        id: data.template_id,
        name: data.title,
        description: data.description,
        weightage: data.measurement_criteria,
        frequency: data.frequency,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    });
    return { success: true, data: response };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const fetchTemplates = async () => {
  try {
    const response = await withAuth(async (token) => {
      const response = await getData(`${env.API_BASE_URL}/kpi/templates`, token);
      const data = Array.isArray(response) ? response : response.data || [];
      return (
        data.map(
          (template: {
            template_id: string;
            title: string;
            description: string;
            measurement_criteria: string;
            frequency: string;
            status: string;
            createdAt: string;
            updatedAt: string;
          }) => ({
            id: template.template_id,
            name: template.title,
            description: template.description,
            weightage: template.measurement_criteria,
            frequency: template.frequency,
            status: template.status,
            createdAt: template.createdAt,
            updatedAt: template.updatedAt
          })
        ) || []
      );
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const fetchTemplateById = async (templateId: string) => {
  try {
    const response = await withAuth(async (token) => {
      const response = await getData(`${env.API_BASE_URL}/kpi/templates/${templateId}`, token);
      const data = response.data || response;
      return {
        id: data.template_id,
        name: data.title,
        description: data.description,
        weightage: data.measurement_criteria,
        frequency: data.frequency,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const updateTemplate = async (templateId: string, updatedFields: Partial<Template>) => {
  try {
    const response = await withAuth(async (token) => {
      const url = `${env.API_BASE_URL}/kpi/templates/${templateId}`;
      const payload = {
        title: updatedFields.name,
        description: updatedFields.description,
        measurement_criteria: updatedFields.weightage,
        frequency: updatedFields.frequency,
        status: updatedFields.status
      };
      const response = await putData(url, payload, token);
      const data = response.data || response;
      return {
        id: data.template_id,
        name: data.title,
        description: data.description,
        weightage: data.measurement_criteria,
        frequency: data.frequency,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    });
    return { success: true, data: response };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const deleteTemplate = async (templateId: string) => {
  try {
    const response = await withAuth(async (token) => {
      const url = `${env.API_BASE_URL}/kpi/templates/${templateId}`;
      return await deleteData(url, token);
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const fetcher = async () => {
  return fetchTemplates();
};
