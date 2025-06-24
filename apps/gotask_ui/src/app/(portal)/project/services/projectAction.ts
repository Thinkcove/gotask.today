import env from "@/app/common/env";
import { IProjectField } from "../interfaces/projectInterface";
import { deleteData, getData, postData, putData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";

// Create Project
export const createProject = async (formData: IProjectField) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/createProject`;
    return postData(url, formData as unknown as Record<string, unknown>, token);
  });
};

// Update Project
export const updateProject = async (projectId: string, updatedFields: IProjectField) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/updateProject/${projectId}`;
    return putData(url, updatedFields as unknown as Record<string, unknown>, token);
  });
};

//fetch status count
export const fetchProjectStatusCounts = async () => {
  return getData(`${env.API_BASE_URL}/projectCount`);
};

// Fetch Projects
export const fetchProjects = async () => {
  return withAuth(async (token) => {
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
  });
};

// Assign Users to Project
export const assignUsersToProject = async (userIds: string[], projectId: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/usertoProject`;
    const payload = {
      user_id: userIds,
      project_id: projectId
    };
    return postData(url, payload, token);
  });
};

// Remove Users from Project
export const removeUsersFromProject = async (userIds: string[], projectId: string) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/removeUser`;
    const payload = {
      user_id: userIds,
      project_id: projectId
    };
    return await postData(url, payload, token);
  });
};

// SWR-compatible fetcher
export const fetcher = async () => {
  return fetchProjects();
};



