import useSWR from "swr";
import env from "@/app/common/env";
import { getData, postData } from "@/app/common/utils/apiData";
import { IFormField, ITaskComment, Project, TaskPayload } from "../interface/taskInterface";

// Modify both hooks with an optional dateRange parameter
export const useProjectGroupTask = (
  page: number,
  pageSize: number,
  taskPage: number,
  taskPageSize: number,
  search_vals?: string[][],
  search_vars?: string[][],
  min_date?: string,
  max_date?: string,
  date_var?: string
) => {
  const fetchProjectTasks = async () => {
    const payload: TaskPayload = {
      page,
      page_size: pageSize,
      task_page: taskPage,
      task_page_size: taskPageSize
    };

    if (search_vals && search_vars) {
      payload.search_vals = search_vals;
      payload.search_vars = search_vars;
    }

    if (min_date && max_date) {
      payload.min_date = min_date;
      payload.max_date = max_date;
      payload.date_var = date_var ?? "due_date";
    }

    return postData(`${env.API_BASE_URL}/tasks/grouped-by-project`, payload);
  };

  const { data, error, mutate, isValidating } = useSWR(
    [
      `fetch-project-tasks`,
      page,
      pageSize,
      taskPage,
      taskPageSize,
      search_vals,
      search_vars,
      date_var
    ],
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

// Same for useUserGroupTask
export const useUserGroupTask = (
  page: number,
  pageSize: number,
  taskPage: number,
  taskPageSize: number,
  search_vals?: string[][],
  search_vars?: string[][],
  min_date?: string,
  max_date?: string,
  date_var?: string
) => {
  const fetchUserTasks = async () => {
    const payload: TaskPayload = {
      page,
      page_size: pageSize,
      task_page: taskPage,
      task_page_size: taskPageSize
    };

    if (search_vals && search_vars) {
      payload.search_vals = search_vals;
      payload.search_vars = search_vars;
    }

    if (min_date && max_date) {
      payload.min_date = min_date;
      payload.max_date = max_date;
      payload.date_var = date_var ?? "due_date";
    }

    return postData(`${env.API_BASE_URL}/tasks/grouped-by-user`, payload);
  };

  const { data, error, mutate, isValidating } = useSWR(
    [
      `fetch-user-tasks`,
      page,
      pageSize,
      taskPage,
      taskPageSize,
      search_vals,
      search_vars,
      date_var
    ],
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

export const logTaskTime = async (
  taskId: string,
  timeLogs: { date: string; time_logged: string }[]
) => {
  const response = await fetch(`${env.API_BASE_URL}/tasklog/${taskId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(timeLogs)
  });

  if (!response.ok) {
    throw new Error("Failed to log task time");
  }

  const result = await response.json();
  return result;
};
