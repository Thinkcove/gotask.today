import env from "@/app/common/env";
import { IProjectField } from "../interfaces/projectInterface";
import { getData, postData, putData } from "@/app/common/utils/apiData";

//createProject
export const createProject = async (formData: IProjectField) => {
  const url = `${env.API_BASE_URL}/createProject`;
  return await postData(url, formData as unknown as Record<string, unknown>);
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
  const { data } = await getData(`${env.API_BASE_URL}/getAllProjects`);

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
    const url = `${env.API_BASE_URL}/usertoProject`;
    return await postData(url, payload);
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
    const url = `${env.API_BASE_URL}/removeUser`;
    return await postData(url, payload);
  } catch (error) {
    console.error("Error while removing users from project:", error);
    throw error; // Propagate error to handle in the calling function
  }
};

// Fetching data using SWR
export const fetcher = async () => {
  const data = await fetchProjects();
  return data;
};
