import { findUserById } from "../../domain/interface/user/userInterface";

import ProjectGoalMessages from "../../constants/apiMessages/projectGoalMessages";
import { IProjectGoal } from "../../domain/model/projectGoal/projectGoal";
import {
  findGoalsByUserId,
  findGoalsByProjectId,
  createProjectGoal,
  getProjectGoalById,
  updateProjectGoal,
  deleteProjectGoal,
  getAllProjectGoals,
  createProjectComment,
  deleteProjectComment,
  updateProjectComment,
  getCommentsByGoalId
} from "../../domain/interface/projectGoal/projectGoal";
import { IProjectComment } from "../../domain/model/projectGoal/projectGoalComment";

// Create a new weekly goal
const createProjectGoalService = async (
  goalData: IProjectGoal
): Promise<{ success: boolean; data?: IProjectGoal; message?: string }> => {
  try {
    if (!goalData) {
      return {
        success: false,
        message: ProjectGoalMessages.CREATE.REQUIRED
      };
    }

    const goal = await createProjectGoal(goalData);
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
const getAllProjectGoalsService = async (): Promise<{
  success: boolean;
  data?: IProjectGoal[];
  message?: string;
}> => {
  try {
    const goals = await getAllProjectGoals();
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
const getProjectGoalByIdService = async (
  id: string
): Promise<{ success: boolean; data?: IProjectGoal | null; message?: string }> => {
  try {
    const goal = await getProjectGoalById(id);
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
const getProjectGoalsByUserIdService = async (
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

    const goals = await findGoalsByUserId(userId);
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
const getProjectGoalsByIdService = async (
  projectId: string
): Promise<{ success: boolean; data?: IProjectGoal[]; message?: string }> => {
  try {
    const goals = await findGoalsByProjectId(projectId);
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
const updateProjectGoalService = async (
  id: string,
  updateData: Partial<IProjectGoal>
): Promise<{ success: boolean; data?: IProjectGoal | null; message?: string }> => {
  try {
    const updatedGoal = await updateProjectGoal(id, updateData);
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
const deleteProjectGoalService = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await deleteProjectGoal(id);
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
// Create a new Project Comment Service
const createProjectCommentService = async (
  commentData: IProjectComment
): Promise<{ success: boolean; data?: IProjectComment; message?: string }> => {
  try {
    const newComment = await createProjectComment(commentData);
    return {
      success: true,
      data: newComment
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    };
  }
};
const getCommentsByGoalIdService = async (
  goalId: string
): Promise<{ success: boolean; data?: IProjectComment[]; message?: string }> => {
  try {
    const comments = await getCommentsByGoalId(goalId);
    return {
      success: true,
      data: comments
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

const updateProjectCommentService = async (
  commentId: string,
  updateData: Partial<IProjectComment>
): Promise<{ success: boolean; data?: IProjectComment | null; message?: string }> => {
  try {
    const updated = await updateProjectComment(commentId, updateData);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

const deleteProjectCommentService = async (
  commentId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const deleted = await deleteProjectComment(commentId);
    if (!deleted) {
      return { success: false, message: "Comment not found" };
    }
    return { success: true, message: "Comment deleted successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export {
  createProjectGoalService,
  getAllProjectGoalsService,
  getProjectGoalByIdService,
  getProjectGoalsByUserIdService,
  getProjectGoalsByIdService,
  updateProjectGoalService,
  deleteProjectGoalService,
  createProjectCommentService,
  getCommentsByGoalIdService,
  updateProjectCommentService,
  deleteProjectCommentService
};
