import {
  getCommentsByGoalId,
  getWeeklyGoalById
} from "@/app/(portal)/project/services/projectAction";
import {
  GoalComment,
  GoalData
} from "@/app/(portal)/project/view/[projectId]/goals/interface/projectGoal";

export const ProjectStatuses = [
  { label: "To Do", color: "#B1AAAA" },
  { label: "In Progress", color: "#F29807" },
  { label: "Hold", color: "#E2A3D5" },
  { label: "Completed", color: "#4CAF50" }
];

export const formatStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case "to-do":
      return "To-Do";
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "blocked":
      return "Blocked";
    default:
      return "Unknown";
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "to-do":
      return "#B0BEC5";
    case "in-progress":
      return "#FF9800";
    case "hold":
      return "#CE93D8";
    case "completed":
      return "#4CAF50";
    default:
      return "#B0BEC5";
  }
};
export const statusOptions = ["to-do", "in-progress", "hold", "completed"];

export const priorityOptions = ["high", "medium", "low"];

export const fetchGoalData = async (goalId: string) => {
  if (!goalId) throw new Error("Goal ID is required");
  const response = await getWeeklyGoalById(goalId);
  return response?.data || null;
};

// Fetcher functions for SWR
export const fetchGoalWithComments = async (goalId: string) => {
  if (!goalId) throw new Error("Goal ID is missing");

  const [goalResponse, commentsResponse] = await Promise.all([
    getWeeklyGoalById(goalId),
    getCommentsByGoalId(goalId)
  ]);

  if (!goalResponse || !goalResponse.data) {
    throw new Error("Goal not found");
  }

  const fullGoal: GoalData & { comments: GoalComment[] } = {
    ...goalResponse.data,
    comments: commentsResponse || []
  };

  return fullGoal;
};

export const GOAL_STATUS = {
  COMPLETED: "completed",
  IN_PROGRESS: "in-progress",
  TO_DO: "to-do"
} as const;
