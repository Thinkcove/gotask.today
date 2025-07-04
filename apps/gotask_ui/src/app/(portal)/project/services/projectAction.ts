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

export const fetchAllLeaves = async () => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/getallleave`;
    const { data } = await getData(url, token);
    return data || [];
  });
};

export const fetchAllPermissions = async () => {
  return withAuth(async (token) => {
    const url = `${env.API_BASE_URL}/getpermission`;
    const { data } = await getData(url, token);
    return data || [];
  });
};

// Interface for Permission Entry (add this to your interface files)
export interface PermissionEntry {
  _id: string;
  user_id: string;
  user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  comments: string[];
  id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export const PERMISSION_BACKGROUND_COLOR = {
  num: "20" // 20% opacity for background
};

export const getPermissionColor = () => {
  return "#ff9800"; // Orange color for permissions
};
export const formatPermissionTime = (startTime: string, endTime: string): string => {
  // Handle different time formats
  const formatTime = (time: string): string => {
    // If time contains AM/PM, return as is
    if (time.includes("AM") || time.includes("PM")) {
      return time;
    }
    // If time is in HH:MM format, convert to 12-hour format
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

// Utility function to calculate permission duration in hours
export const calculatePermissionDuration = (startTime: string, endTime: string): number => {
  const parseTime = (time: string): number => {
    let cleanTime = time.replace(/\s*(AM|PM)\s*/i, "");
    const [hours, minutes] = cleanTime.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;

    // Handle AM/PM conversion
    if (time.toUpperCase().includes("PM") && hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (time.toUpperCase().includes("AM") && hours === 12) {
      totalMinutes -= 12 * 60;
    }

    return totalMinutes;
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);
  const durationMinutes = endMinutes - startMinutes;

  return Math.round((durationMinutes / 60) * 100) / 100; // Round to 2 decimal places
};