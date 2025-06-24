import env from "@/app/common/env";
import { deleteData, getData, postData, putData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";

export const createWeeklyGoal = async (goalData: {
  projectId: string;
  goalTitle: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  description: string;
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
    priority: string;
    updated_by: string;
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
  priority?: string;
  status?: string;
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