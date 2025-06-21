import env from "@/app/common/env";
import { deleteData, getData, postData, putData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";

export const fetchWeeklyGoals = async () => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/project/goals`;
    const { data } = await getData(url, token);
    return data || [];
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
    const url = `${env.API_BASE_URL}/project/goals/${goalId}`;
    return await putData(url, updatedGoalData, token);
  });
};
// Get Weekly Goal by ID
export const getWeeklyGoalById = async (goalId: string) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/project/goals/${goalId}`;
    const { data } = await getData(url, token);
    return data;
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
    return data || [];
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
