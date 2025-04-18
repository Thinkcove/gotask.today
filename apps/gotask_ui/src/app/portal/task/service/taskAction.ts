import useSWR from "swr";
import env from "@/app/common/env";
import { getData, postData } from "@/app/common/utils/apiData";
import { IFormField, ITaskComment, Project, ProjectTaskPayload } from "../interface/taskInterface";

//fetch taskbyproject-grouping
export const useProjectGroupTask = (
  page: number,
  pageSize: number,
  taskPage: number,
  taskPageSize: number,
  search_vals?: string[][],
  search_vars?: string[][]
) => {
  const fetchProjectTasks = async () => {
    const payload: ProjectTaskPayload = {
      page,
      page_size: pageSize,
      task_page: taskPage,
      task_page_size: taskPageSize
    };

    // Add search parameters only if provided
    if (search_vals && search_vars) {
      payload.search_vals = search_vals;
      payload.search_vars = search_vars;
    }

    return postData(`${env.API_BASE_URL}/tasks/grouped-by-project`, payload);
  };

  const { data, error, mutate, isValidating } = useSWR(
    [`fetch-project-tasks`, page, pageSize, taskPage, taskPageSize, search_vals, search_vars],
    fetchProjectTasks,
    { revalidateOnFocus: false }
  );

  return {
    tasksByProjects: data?.data?.taskbyprojects || [],
    isLoading: !data && !error,
    isError: !!error,
    mutate,
    isValidating
  };
};

//fetch taskbyuser-grouping

export const useUserGroupTask = (
  page: number,
  pageSize: number,
  taskPage: number,
  taskPageSize: number,
  search_vals?: string[][],
  search_vars?: string[][]
) => {
  const fetchUserTasks = async () => {
    const payload: ProjectTaskPayload = {
      page,
      page_size: pageSize,
      task_page: taskPage,
      task_page_size: taskPageSize
    };

    // Add search parameters only if provided
    if (search_vals && search_vars) {
      payload.search_vals = search_vals;
      payload.search_vars = search_vars;
    }

    return postData(`${env.API_BASE_URL}/tasks/grouped-by-user`, payload);
  };
  const { data, error, mutate, isValidating } = useSWR(
    [`fetch-user-tasks`, page, pageSize, taskPage, taskPageSize, search_vals, search_vars],
    fetchUserTasks,
    { revalidateOnFocus: false }
  );

  return {
    tasksByUsers: data?.data?.taskbyusers || [],
    isLoading: !data && !error,
    isError: !!error,
    mutate,
    isValidating
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
    revalidateOnFocus: false
  });
  return {
    getAllUsers:
      data?.data?.map((user: { name: string; id: string }) => ({
        name: user.name,
        id: user.id
      })) || []
  };
};

//fetch all projects
const fetchProject = async () => {
  return getData(`${env.API_BASE_URL}/getAllProjects`);
};

export const fetchAllProjects = () => {
  const { data } = useSWR([`fetchproject`], () => fetchProject(), {
    revalidateOnFocus: false
  });
  return {
    getAllProjects:
      data?.data?.map((project: { name: string; id: string }) => ({
        name: project.name,
        id: project.id
      })) || []
  };
};

//createTask
export const createTask = async (formData: IFormField) => {
  const response = await fetch(`${env.API_BASE_URL}/createTask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  return response.json();
};

//update a task
export const updateTask = async (taskId: string, updatedFields: object) => {
  const response = await fetch(`${env.API_BASE_URL}/updateTask/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedFields)
  });
  if (!response.ok) {
    throw new Error("Failed to update task");
  }
  return response.json();
};

//create comment
export const createComment = async (formData: ITaskComment) => {
  const response = await fetch(`${env.API_BASE_URL}/task/createComment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  if (!response.ok) {
    throw new Error("Failed to create comment");
  }
  return response.json();
};

// Get project IDs and names by user ID
export const getProjectIdsAndNames = async (userId: string) => {
  const response = await fetch(`${env.API_BASE_URL}/getProjectbyUserId/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  const data = await response.json();
  // Extract only id and name
  return data.success
    ? data.data.map((project: Project) => ({ id: project.id, name: project.name }))
    : [];
};
