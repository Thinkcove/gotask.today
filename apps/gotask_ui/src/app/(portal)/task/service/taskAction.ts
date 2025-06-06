import useSWR from "swr";
import env from "@/app/common/env";
import { getData, postData, putData } from "@/app/common/utils/apiData";
import { IFormField, ITaskComment, Project, TaskPayload, User } from "../interface/taskInterface";
import { withAuth } from "@/app/common/utils/authToken";
import { SortOrder, TaskSortField } from "@/app/common/constants/task";

// Modify both hooks with an optional dateRange parameter
export const useProjectGroupTask = (
  page?: number,
  pageSize?: number,
  search_vals?: string[][],
  search_vars?: string[][],
  min_date?: string,
  max_date?: string,
  date_var?: string,
  more_variation?: string,
  less_variation?: string,
  sort_field?: TaskSortField,
  sort_order?: SortOrder
) => {
  const fetchProjectTasks = () =>
    withAuth((token) => {
      const payload: TaskPayload = {
        page,
        page_size: pageSize,
        ...(search_vals && search_vars && { search_vals, search_vars }),
        ...(min_date &&
          max_date && {
            min_date,
            max_date,
            date_var: date_var ?? "due_date"
          }),
        ...(more_variation && { more_variation }),
        ...(less_variation && { less_variation })
      };
      return postData(`${env.API_BASE_URL}/tasks/grouped-by-project`, payload, token);
    });

  const { data, error, mutate, isValidating } = useSWR(
    [
      `fetch-project-tasks`,
      page,
      pageSize,
      search_vals,
      search_vars,
      min_date,
      max_date,
      date_var,
      more_variation,
      less_variation,
      sort_field,
      sort_order
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

// User Group Tasks
export const useUserGroupTask = (
  page?: number,
  pageSize?: number,
  search_vals?: string[][],
  search_vars?: string[][],
  min_date?: string,
  max_date?: string,
  date_var?: string,
  more_variation?: string,
  less_variation?: string,
  sort_field?: TaskSortField,
  sort_order?: SortOrder
) => {
  const fetchUserTasks = () =>
    withAuth((token) => {
      const payload: TaskPayload = {
        page,
        page_size: pageSize,
        ...(search_vals && search_vars && { search_vals, search_vars }),
        ...(min_date &&
          max_date && {
            min_date,
            max_date,
            date_var: date_var ?? "due_date"
          }),
        ...(more_variation && { more_variation }),
        ...(less_variation && { less_variation }),
        ...(sort_field && { sort_field }),
        ...(sort_order && { sort_order })
      };
      return postData(`${env.API_BASE_URL}/tasks/grouped-by-user`, payload, token);
    });

  const { data, error, mutate, isValidating } = useSWR(
    [
      `fetch-user-tasks`,
      page,
      pageSize,
      search_vals,
      search_vars,
      min_date,
      max_date,
      date_var,
      more_variation,
      less_variation,
      sort_field,
      sort_order
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
  withAuth((token) => getData(`${env.API_BASE_URL}/tasks/status-count`, token));
};

//fetch all users
export const fetchUser = () =>
  withAuth((token) => getData(`${env.API_BASE_URL}/getAllUsers`, token));

export const useAllUsers = () => {
  const { data } = useSWR([`fetchuser`], fetchUser, {
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
export const fetchProject = () =>
  withAuth((token) => getData(`${env.API_BASE_URL}/getAllProjects`, token));

export const useAllProjects = () => {
  const { data } = useSWR([`fetchproject`], fetchProject, {
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
export const createTask = (formData: IFormField) =>
  withAuth(async (token) => {
    const response = await fetch(`${env.API_BASE_URL}/createTask`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  });

//update a task
export const updateTask = (taskId: string, updatedFields: object) =>
  withAuth(async (token) => {
    const response = await fetch(`${env.API_BASE_URL}/updateTask/${taskId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedFields)
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  });

//create comment
export const createComment = (formData: ITaskComment) =>
  withAuth(async (token) => {
    return postData(
      `${env.API_BASE_URL}/task/createComment`,
      { ...formData } as Record<string, unknown>,
      token
    );
  });

// Get Projects by User
export const getProjectIdsAndNames = async (userId: string) => {
  const response = await fetch(`${env.API_BASE_URL}/getProjectbyUserId/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  const data = await response.json();
  return data.success
    ? data.data.map((project: Project) => ({ id: project.id, name: project.name }))
    : [];
};

export const getUsersByProjectId = async (projectId: string) => {
  const response = await fetch(`${env.API_BASE_URL}/getUsersByProjectId/${projectId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  const data = await response.json();
  return data.success ? data.data.map((user: User) => ({ id: user.id, name: user.name })) : [];
};

// Log Task Time
export const logTaskTime = async (
  taskId: string,
  timeLogs: { date: string; start_time: string; end_time: string }[]
) => {
  const response = await fetch(`${env.API_BASE_URL}/tasklog/${taskId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(timeLogs)
  });
  return response.json();
};

// Update a comment
export const updateComment = (commentData: ITaskComment) =>
  withAuth(async (token) => {
    return putData(
      `${env.API_BASE_URL}/task/updateComment/${commentData.id}`,
      { ...commentData } as Record<string, unknown>,
      token
    );
  });
