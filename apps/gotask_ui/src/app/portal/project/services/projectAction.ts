import env from "@/app/common/env";
import { IProjectField } from "../interfaces/projectInterface";
import { getData } from "@/app/common/utils/apiData";

//createProject
export const createProject = async (formData: IProjectField) => {
  const response = await fetch(`${env.API_BASE_URL}/createProject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  return response.json();
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
        user_id: string[];
      }) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        user_id: project.user_id
      })
    ) || []
  );
};
