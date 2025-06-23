import env from "@/app/common/env";
import { Template } from "./templateInterface";
import { getData, postData, putData, deleteData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";

// Create Template
export const createTemplate = async (payload: Partial<Template>) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/kpi/template`;
    const response = await postData(url, payload as unknown as Record<string, unknown>, token);
    const data = response.data || response;
    if (!data.template_id) {
      throw new Error("Missing template_id in response");
    }
    return {
      id: data.template_id,
      title: data.title || data.name,
      description: data.description,
      measurement_criteria: data.measurement_criteria || data.weightage,
      frequency: data.frequency,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  });
};

// Fetch Templates
export const fetchTemplates = async () => {
  return withAuth(async (token) => {
    const response = await getData(`${env.API_BASE_URL}/kpi/templates`, token);
    const data = Array.isArray(response) ? response : response.data || [];
    return (
      data.map(
        (template: {
          template_id: string;
          title?: string;
          name?: string;
          description?: string;
          measurement_criteria?: string;
          weightage?: string;
          frequency?: string;
          status: string;
          createdAt?: any;
          updatedAt?: any;
        }) => ({
          id: template.template_id,
          title: template.title || template.name,
          description: template.description,
          measurement_criteria: template.measurement_criteria || template.weightage,
          frequency: template.frequency,
          status: template.status,
          createdAt: template.createdAt,
          updatedAt: template.updatedAt
        })
      ) || []
    );
  });
};

// Fetch Template by ID
export const fetchTemplateById = async (id: string) => {
  return withAuth(async function (token) {
    const response = await getData(`${env.API_BASE_URL}/kpi/templates/${id}`, token);
    const data = response.data || response;
    return {
      id: data.template_id,
      title: data.title || data.name,
      description: data.description,
      measurement_criteria: data.measurement_criteria || data.weightage,
      frequency: data.frequency,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  });
};

// Update Template
export const updateTemplate = async (templateId: string, updatedFields: Partial<Template>) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/kpi/templates/${templateId}`;
    const response = await putData(url, updatedFields as unknown as Record<string, unknown>, token);
    const data = response.data || response;
    return {
      id: data.template_id,
      title: data.title || data.name,
      description: data.description,
      measurement_criteria: data.measurement_criteria || data.weightage,
      frequency: data.frequency,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  });
};

// Delete Template
export const deleteTemplate = async (templateId: string) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/kpi/templates/${templateId}`;
    return await deleteData(url, token);
  });
};

// SWR-compatible fetcher
export const fetcher = async () => {
  return fetchTemplates();
};
