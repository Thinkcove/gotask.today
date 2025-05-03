import env from "@/app/common/env";
import { IProjectField } from "../interfaces/projectInterface";
import { getData, postData, putData } from "@/app/common/utils/apiData";
import { fetchToken } from "@/app/common/utils/authToken";

//createProject
export const createProject = async (formData: IProjectField) => {
  const token = fetchToken();
  if (!token) {
    return { error: "Please login again." };
  }
  const url = `${env.API_BASE_URL}/createProject`;
  return await postData(url, formData as unknown as Record<string, unknown>, token);
};

//update a project
export const updateProject = async (projectId: string, updatedFields: IProjectField) => {
  const url = `${env.API_BASE_URL}/updateProject/${projectId}`;
  return await putData(url, updatedFields as unknown as Record<string, unknown>);
};

//fetch status count
export const fetchProjectStatusCounts = async () => {
  return getData(`${env.API_BASE_URL}/projectCount`);
};

export const fetchProjects = async () => {
  const token = fetchToken();
  if (!token) {
    return { error: "Please login again." };
  }
  const { data } = await getData(`${env.API_BASE_URL}/getAllProjects`, token);

  return (
    data?.map(
      (project: {
        name: string;
        id: string;
        description: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        users: string[];
      }) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        users: project.users
      })
    ) || []
  );
};

// Assigne user to project
export const assignUsersToProject = async (userIds: string[], projectId: string) => {
  try {
    const payload = {
      user_id: userIds,
      project_id: projectId
    };
    const token = fetchToken();
    if (!token) {
      return { error: "Please login again." };
    }
    const url = `${env.API_BASE_URL}/usertoProject`;
    return await postData(url, payload, token);
  } catch (error) {
    console.error("Error assigning users to project:", error);
    throw error;
  }
};

//removing users from the project
export const removeUsersFromProject = async (userIds: string[], projectId: string) => {
  try {
    const payload = {
      user_id: userIds,
      project_id: projectId
    };
    const token = fetchToken();
    if (!token) {
      return { error: "Please login again." };
    }
    const url = `${env.API_BASE_URL}/removeUser`;
    return await postData(url, payload, token);
  } catch {
    return {
      message: "failed"
    };
  }
};

// Fetching data using SWR
export const fetcher = async () => {
  const data = await fetchProjects();
  return data;
};
