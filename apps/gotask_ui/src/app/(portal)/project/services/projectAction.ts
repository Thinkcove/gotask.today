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
export const fetchWeeklyGoals = async ({
  page = 1,
  pageSize = 10,
  priority,
  status,
  startDate,
  endDate,
  goalTitle
}: {
  page?: number;
  pageSize?: number;
  priority?: string ;
  status?: string ;
  startDate?: string;
  endDate?: string;
  goalTitle?: string;
}) => {
  return withAuth(async (token) => {
    // Construct the payload with only the provided parameters
    const payload: { [key: string]: any } = {
      page,
      pageSize
    };

    if (priority) payload.priority = priority;
    if (status) payload.status = status;
    if (startDate) payload.startDate = startDate;
    if (endDate) payload.endDate = endDate;
    if (goalTitle) payload.goalTitle = goalTitle;

    const url = `${env.API_BASE_URL}/projectgoals`;
    const { data } = await postData(url, payload, token);
    return data || { items: [], totalPages: 1 };
  });
};



// Create Weekly Goal
export const createWeeklyGoal = async (goalData: {
  projectId: string;
  goalTitle: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  description: string;
  comments: Comment[];
  priority: string;
}) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/project/goals`;
    return await postData(url, goalData, token);
  });
};

export const updateWeeklyGoal = async (
  goalId: string,
  updatedGoalData: {
    projectId: string;
    goalTitle: string;
    weekStart: string;
    weekEnd: string;
    status: string;
    description: string;
    comments: Comment[];
    priority: string;
  }
) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/projectgoals/${goalId}`;
    return await putData(url, updatedGoalData, token);
  });
};
// Get Weekly Goal by ID
export const getWeeklyGoalById = async (goalId: string) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/projectgoals/${goalId}`;
    const response = await getData(url, token);
    console.log("✅ Full Goal DataApi Response:", response);

    // ✅ The path is correct: response.data.goal.data
    const goalData = response;
    if (!goalData) {
      throw new Error("Goal data missing in response");
    }
    return goalData;
  });
};

// Create a new comment
export const createComment = async (commentData: {
  goal_id: string;
  comments: string[];
  user_id?: string;
}) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/project/goals/comments`;
    return await postData(url, commentData, token);
  });
};

// Get all comments for a specific goal
export const getCommentsByGoalId = async (goalId: string) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/project/goals/comments/${goalId}`;
    const { data } = await getData(url, token);
    return data;
  });
};

// Update a comment
export const updateComment = async (
  commentId: string | number,
  updatedCommentData: {
    comments: string[];
  }
) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/project/goals/comments/${commentId}`;
    return await putData(url, updatedCommentData, token);
  });
};

// Delete a comment
export const deleteComment = async (commentId: string | number) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/project/goals/comments/${commentId}`;
    return await deleteData(url, token);
  });
};
