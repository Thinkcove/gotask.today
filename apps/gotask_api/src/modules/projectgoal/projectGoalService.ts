import { findUserById } from "../../domain/interface/user/userInterface";

import ProjectGoalMessages from "../../constants/apiMessages/projectGoalMessages";
import { IProjectGoal } from "../../domain/model/projectGoal/projectGoal";
import {
  findGoalsByUserIdNew,
  findGoalsByProjectIdNew,
  createProjectGoalNew,
  getProjectGoalByIdNew,
  updateProjectGoalNew,
  deleteProjectGoalNew,
  getAllProjectGoalsNew
} from "../../domain/interface/projectGoal/projectGoal";

// Create a new weekly goal
const createProjectGoal = async (
  goalData: IProjectGoal
): Promise<{ success: boolean; data?: IProjectGoal; message?: string }> => {
  try {
    if (!goalData) {
      return {
        success: false,
        message: ProjectGoalMessages.CREATE.REQUIRED
      };
    }

    const goal = await createProjectGoalNew(goalData);
    return {
      success: true,
      data: goal
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectGoalMessages.CREATE.FAILED
    };
  }
};

// Get all weekly goals
const getAllProjectGoals = async (): Promise<{
  success: boolean;
  data?: IProjectGoal[];
  message?: string;
}> => {
  try {
    const goals = await getAllProjectGoalsNew();
    return {
      success: true,
      data: goals
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectGoalMessages.FETCH.FAILED_ALL
    };
  }
};

// Get weekly goal by ID
const getProjectGoalById = async (
  id: string
): Promise<{ success: boolean; data?: IProjectGoal | null; message?: string }> => {
  try {
    const goal = await getProjectGoalByIdNew(id);
    if (!goal) {
      return {
        success: false,
        message: ProjectGoalMessages.FETCH.NOT_FOUND
      };
    }

    return {
      success: true,
      data: goal
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectGoalMessages.FETCH.FAILED_BY_ID
    };
  }
};

// Get weekly goals by user ID
const getProjectGoalsByUserId = async (
  userId: string
): Promise<{ success: boolean; data?: IProjectGoal[]; message?: string }> => {
  try {
    if (!userId) {
      return {
        success: false,
        message: ProjectGoalMessages.USER.REQUIRED
      };
    }

    const user = await findUserById(userId);
    if (!user) {
      return {
        success: false,
        message: ProjectGoalMessages.USER.NOT_FOUND
      };
    }

    const goals = await findGoalsByUserIdNew(userId);
    return {
      success: true,
      data: goals
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectGoalMessages.FETCH.FAILED_BY_USER
    };
  }
};

// Get weekly goals by project ID
const getProjectGoalsByProjectId = async (
  projectId: string
): Promise<{ success: boolean; data?: IProjectGoal[]; message?: string }> => {
  try {
    const goals = await findGoalsByProjectIdNew(projectId);
    return {
      success: true,
      data: goals
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectGoalMessages.FETCH.FAILED_BY_PROJECT
    };
  }
};

// Update a weekly goal
const updateProjectGoal = async (
  id: string,
  updateData: Partial<IProjectGoal>
): Promise<{ success: boolean; data?: IProjectGoal | null; message?: string }> => {
  try {
    const updatedGoal = await updateProjectGoalNew(id, updateData);
    if (!updatedGoal) {
      return {
        success: false,
        message: ProjectGoalMessages.UPDATE.NOT_FOUND
      };
    }

    return {
      success: true,
      data: updatedGoal
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectGoalMessages.UPDATE.FAILED
    };
  }
};

// Delete a weekly goal
const deleteProjectGoal = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await deleteProjectGoalNew(id);
    if (!result) {
      return {
        success: false,
        message: ProjectGoalMessages.DELETE.NOT_FOUND
      };
    }

    return {
      success: true,
      message: ProjectGoalMessages.DELETE.SUCCESS
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectGoalMessages.DELETE.FAILED
    };
  }
};

export {
  createProjectGoal,
  getAllProjectGoals,
  getProjectGoalById,
  getProjectGoalsByUserId,
  getProjectGoalsByProjectId,
  updateProjectGoal,
  deleteProjectGoal
};
