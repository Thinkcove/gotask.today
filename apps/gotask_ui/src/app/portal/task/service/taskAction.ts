import useSWR from "swr";
import env from "@/app/common/env";
import { getData, postData } from "@/app/common/utils/apiData";

//fetch taskbyproject-grouping
const fetchProjectTasks = async (
  page: number,
  pageSize: number,
  taskPage: number,
  taskPageSize: number
) => {
  const payload = {
    page,
    page_size: pageSize,
    task_page: taskPage,
    task_page_size: taskPageSize,
  };
  return postData(`${env.API_BASE_URL}/tasks/grouped-by-project`, payload);
};

export const useProjectGroupTask = (
  page: number,
  pageSize: number,
  taskPage: number,
  taskPageSize: number
) => {
  const { data, error, mutate, isValidating } = useSWR(
    [`fetch-project-tasks`, page, pageSize, taskPage, taskPageSize],
    () => fetchProjectTasks(page, pageSize, taskPage, taskPageSize),
    { revalidateOnFocus: false }
  );

  return {
    tasksByProjects: data?.data?.taskbyprojects || [],
    isLoading: !data && !error,
    isError: !!error,
    mutate,
    isValidating,
  };
};

//fetch taskbyuser-grouping
const fetchUserTasks = async (
  page: number,
  pageSize: number,
  taskPage: number,
  taskPageSize: number
) => {
  const payload = {
    page,
    page_size: pageSize,
    task_page: taskPage,
    task_page_size: taskPageSize,
  };
  return postData(`${env.API_BASE_URL}/tasks/grouped-by-user`, payload); // ✅ Corrected endpoint
};

export const useUserGroupTask = (
  page: number,
  pageSize: number,
  taskPage: number,
  taskPageSize: number
) => {
  const { data, error, mutate, isValidating } = useSWR(
    [`fetch-user-tasks`, page, pageSize],
    () => fetchUserTasks(page, pageSize, taskPage, taskPageSize),
    { revalidateOnFocus: false }
  );

  return {
    tasksByUsers: data?.data?.taskbyusers || [],
    isLoading: !data && !error,
    isError: !!error,
    mutate,
    isValidating,
  };
};

//fetch status count
export const fetchTaskStatusCounts = async () => {
  return getData(`${env.API_BASE_URL}/tasks/status-count`);
};

//fetch all users
const fetchUser = async () => {
  return getData(`${env.API_BASE_URL}/getAllUsers`);
};

export const fetchAllUsers = () => {
  const { data } = useSWR([`fetchuser`], () => fetchUser(), {
    revalidateOnFocus: false,
  });
  return {
    getAllUsers:
      data?.data?.map((user: { name: string; id: string }) => ({
        name: user.name,
        id: user.id,
      })) || [],
  };
};

//fetch all projects
const fetchProject = async () => {
  return getData(`${env.API_BASE_URL}/getAllProjects`);
};

export const fetchAllProjects = () => {
  const { data } = useSWR([`fetchproject`], () => fetchProject(), {
    revalidateOnFocus: false,
  });
  return {
    getAllProjects:
      data?.data?.map((project: { name: string; id: string }) => ({
        name: project.name,
        id: project.id,
      })) || [],
  };
};

//createTask
export const createTask = async (formData: any) => {
  const response = await fetch(`${env.API_BASE_URL}/createTask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  return response.json();
};

export const updateTask = async (taskId: string, updatedFields: object) => {
  const response = await fetch(`${env.API_BASE_URL}/updateTask/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedFields),
  });
  if (!response.ok) {
    throw new Error("Failed to update task");
  }
  return response.json();
};
