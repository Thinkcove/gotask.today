import { findUserById } from "../../domain/interface/user/userInterface";

import WeeklyGoalMessages from "../../constants/apiMessages/weeklyGoalMessage";
import { IWeeklyGoal } from "../../domain/model/trackwekly/trackwekly";
import {
  createWeeklyGoalNew,
  getAllWeeklyGoalsNew,
  getWeeklyGoalByIdNew,
  updateWeeklyGoalNew,
  deleteWeeklyGoalNew,
  findGoalsByUserIdNew,
  findGoalsByProjectIdNew
} from "../../domain/interface/trackwekly/trackwekly";

// Create a new weekly goal
const createWeeklyGoal = async (
  goalData: IWeeklyGoal
): Promise<{ success: boolean; data?: IWeeklyGoal; message?: string }> => {
  try {
    if (!goalData) {
      return {
        success: false,
        message: WeeklyGoalMessages.CREATE.REQUIRED
      };
    }

    const goal = await createWeeklyGoalNew(goalData);
    return {
      success: true,
      data: goal
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || WeeklyGoalMessages.CREATE.FAILED
    };
  }
};

// Get all weekly goals
const getAllWeeklyGoals = async (): Promise<{
  success: boolean;
  data?: IWeeklyGoal[];
  message?: string;
}> => {
  try {
    const goals = await getAllWeeklyGoalsNew();
    return {
      success: true,
      data: goals
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || WeeklyGoalMessages.FETCH.FAILED_ALL
    };
  }
};

// Get weekly goal by ID
const getWeeklyGoalById = async (
  id: string
): Promise<{ success: boolean; data?: IWeeklyGoal | null; message?: string }> => {
  try {
    const goal = await getWeeklyGoalByIdNew(id);
    if (!goal) {
      return {
        success: false,
        message: WeeklyGoalMessages.FETCH.NOT_FOUND
      };
    }

    return {
      success: true,
      data: goal
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || WeeklyGoalMessages.FETCH.FAILED_BY_ID
    };
  }
};

// Get weekly goals by user ID
const getWeeklyGoalsByUserId = async (
  userId: string
): Promise<{ success: boolean; data?: IWeeklyGoal[]; message?: string }> => {
  try {
    if (!userId) {
      return {
        success: false,
        message: WeeklyGoalMessages.USER.REQUIRED
      };
    }

    const user = await findUserById(userId);
    if (!user) {
      return {
        success: false,
        message: WeeklyGoalMessages.USER.NOT_FOUND
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
      message: error.message || WeeklyGoalMessages.FETCH.FAILED_BY_USER
    };
  }
};

// Get weekly goals by project ID
const getWeeklyGoalsByProjectId = async (
  projectId: string
): Promise<{ success: boolean; data?: IWeeklyGoal[]; message?: string }> => {
  try {
    const goals = await findGoalsByProjectIdNew(projectId);
    return {
      success: true,
      data: goals
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || WeeklyGoalMessages.FETCH.FAILED_BY_PROJECT
    };
  }
};

// Update a weekly goal
const updateWeeklyGoal = async (
  id: string,
  updateData: Partial<IWeeklyGoal>
): Promise<{ success: boolean; data?: IWeeklyGoal | null; message?: string }> => {
  try {
    const updatedGoal = await updateWeeklyGoalNew(id, updateData);
    if (!updatedGoal) {
      return {
        success: false,
        message: WeeklyGoalMessages.UPDATE.NOT_FOUND
      };
    }

    return {
      success: true,
      data: updatedGoal
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || WeeklyGoalMessages.UPDATE.FAILED
    };
  }
};

// Delete a weekly goal
const deleteWeeklyGoal = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await deleteWeeklyGoalNew(id);
    if (!result) {
      return {
        success: false,
        message: WeeklyGoalMessages.DELETE.NOT_FOUND
      };
    }

    return {
      success: true,
      message: WeeklyGoalMessages.DELETE.SUCCESS
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || WeeklyGoalMessages.DELETE.FAILED
    };
  }
};

export {
  createWeeklyGoal,
  getAllWeeklyGoals,
  getWeeklyGoalById,
  getWeeklyGoalsByUserId,
  getWeeklyGoalsByProjectId,
  updateWeeklyGoal,
  deleteWeeklyGoal
};
