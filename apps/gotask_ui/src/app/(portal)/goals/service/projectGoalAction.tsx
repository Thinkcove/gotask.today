import env from "@/app/common/env";
import { getData, postData, putData } from "@/app/common/utils/apiData";
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
  comments: string[];
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
    comments: string[];
    priority: string;
  }
) => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/project/goals/${goalId}`;
    return await putData(url, updatedGoalData, token);
  });
};
