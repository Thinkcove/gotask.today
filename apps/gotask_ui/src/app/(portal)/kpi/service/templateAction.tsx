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

// Create KPI Assignment
export const createKpiAssignment = async (payload: {
  user_id: string;
  template_id?: string;
  kpi_Title?: string;
  kpi_Description?: string;
  measurement_criteria: string;
  frequency: string;
  weightage: number;
  assigned_by: string;
  reviewer_id?: string;
  status?: string;
  saveAs_Template?: boolean;
  authUserId?: string;
}) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/createEmployeeAssignment`;
    const response = await postData(url, payload as Record<string, unknown>, token);
    const data = response.data || response;
    if (!data.assignment_id) {
      throw new Error("Missing assignment_id in response");
    }
    return {
      assignment_id: data.assignment_id,
      user_id: data.user_id,
      template_id: data.template_id,
      kpi_Title: data.kpi_Title,
      kpi_Description: data.kpi_Description,
      measurement_criteria: data.measurement_criteria,
      frequency: data.frequency,
      weightage: data.weightage,
      assigned_by: data.assigned_by,
      reviewer_id: data.reviewer_id,
      status: data.status,
      saveAs_Template: data.saveAs_Template,
      comments: data.comments || [],
      change_History: data.change_History || []
    };
  });
};

// Fetch All KPI Assignments
export const fetchAllKpiAssignments = async () => {
  return withAuth(async (token) => {
    const response = await getData(`${env.API_BASE_URL}/getAllAssignments`, token);
    const data = Array.isArray(response) ? response : response.data || [];
    return data.map(
      (assignment: {
        assignment_id: string;
        user_id: string;
        template_id?: string;
        kpi_Title: string;
        kpi_Description: string;
        measurement_criteria: string;
        frequency: string;
        weightage: number;
        assigned_by: string;
        reviewer_id?: string;
        status: string;
        comments?: string[];
        change_History?: { changedBy: string; changedAt: string; changes: Record<string, any> }[];
      }) => ({
        assignment_id: assignment.assignment_id,
        user_id: assignment.user_id,
        template_id: assignment.template_id,
        kpi_Title: assignment.kpi_Title,
        kpi_Description: assignment.kpi_Description,
        measurement_criteria: assignment.measurement_criteria,
        frequency: assignment.frequency,
        weightage: assignment.weightage,
        assigned_by: assignment.assigned_by,
        reviewer_id: assignment.reviewer_id,
        status: assignment.status,
        comments: assignment.comments || [],
        change_History: assignment.change_History || []
      })
    );
  });
};

// Fetch KPI Assignment by ID
export const fetchKpiAssignmentById = async (assignmentId: string) => {
  return withAuth(async (token) => {
    const response = await getData(`${env.API_BASE_URL}/getAssignmentById/${assignmentId}`, token);
    const data = response.data || response;
    return {
      assignment_id: data.assignment_id,
      user_id: data.user_id,
      template_id: data.template_id,
      kpi_Title: data.kpi_Title,
      kpi_Description: data.kpi_Description,
      measurement_criteria: data.measurement_criteria,
      frequency: data.frequency,
      weightage: data.weightage,
      assigned_by: data.assigned_by,
      reviewer_id: data.reviewer_id,
      status: data.status,
      comments: data.comments || [],
      change_History: data.change_History || []
    };
  });
};

// Update KPI Assignment
export const updateKpiAssignment = async (
  assignmentId: string,
  updatedFields: Partial<{
    user_id: string;
    template_id?: string;
    kpi_Title?: string;
    kpi_Description?: string;
    measurement_criteria: string;
    frequency: string;
    weightage: number;
    assigned_by: string;
    reviewer_id?: string;
    status?: string;
    comments?: string[];
    authUserId: string;
  }>
) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/updateAssignment/${assignmentId}`;
    const response = await putData(url, updatedFields as Record<string, unknown>, token);
    const data = response.data || response;
    return {
      assignment_id: data.assignment_id,
      user_id: data.user_id,
      template_id: data.template_id,
      kpi_Title: data.kpi_Title,
      kpi_Description: data.kpi_Description,
      measurement_criteria: data.measurement_criteria,
      frequency: data.frequency,
      weightage: data.weightage,
      assigned_by: data.assigned_by,
      reviewer_id: data.reviewer_id,
      status: data.status,
      comments: data.comments || [],
      change_History: data.change_History || []
    };
  });
};

// Delete KPI Assignment
export const deleteKpiAssignment = async (assignmentId: string) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/deleteAssignment/${assignmentId}`;
    return await deleteData(url, token);
  });
};

// Fetch Templates by User ID
export const fetchTemplatesByUserId = async (userId: string) => {
  return withAuth(async (token) => {
    const response = await getData(`${env.API_BASE_URL}/getTemplatesByUserId/${userId}`, token);

    const data = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
    return data;
  });
};

// SWR-compatible fetcher
export const fetcher = async () => {
  return fetchTemplates();
};
