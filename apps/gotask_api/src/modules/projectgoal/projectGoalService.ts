import { findUserById } from "../../domain/interface/user/userInterface";

import ProjectGoalMessages from "../../constants/apiMessages/projectGoalMessages";
import { IProjectGoal, ProjectGoal } from "../../domain/model/projectGoal/projectGoal";
import {
  findGoalsByUserId,
  findGoalsByProjectId,
  createProjectGoal,
  getProjectGoalById,
  updateProjectGoal,
  deleteProjectGoal,
  createProjectComment,
  deleteProjectComment,
  updateProjectComment,
  getCommentsByGoalId
} from "../../domain/interface/projectGoal/projectGoal";
import { IProjectComment } from "../../domain/model/projectGoal/projectGoalComment";
import { ProjectGoalUpdateHistory } from "../../domain/model/projectGoal/projectGoalUpdateHistory";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../../constants/utils/common";

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
const getAllProjectGoalsService = async (filters: {
  page?: number;
  pageSize?: number;
  priority?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  goalTitle?: string;
}): Promise<{
  success: boolean;
  data?: {
    goals: IProjectGoal[];
    total: number;
    page: number;
    totalPages: number;
  };
  message?: string;
}> => {
  try {
    const {
      page = DEFAULT_PAGE,
      pageSize = DEFAULT_PAGE_SIZE,
      priority,
      status,
      startDate,
      endDate,
      goalTitle
    } = filters;

    const query: any = {};

    if (priority) query.priority = priority;
    if (status) query.status = status;

    if (startDate && endDate) {
      query.weekStart = { $gte: new Date(startDate) };
      query.weekEnd = { $lte: new Date(endDate) };
    }

    if (goalTitle) {
      query.goalTitle = { $regex: goalTitle, $options: "i" };
    }

    const total = await ProjectGoal.countDocuments(query);
    const goals = await ProjectGoal.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: {
        goals,
        total,
        page,
        totalPages: Math.ceil(total / pageSize)
      }
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

const updateProjectGoalService = async (
  id: string,
  updateData: Partial<IProjectGoal>,
  userId: string
): Promise<{ success: boolean; data?: IProjectGoal | null; message?: string }> => {
  try {
    const existingGoal = await ProjectGoal.findOne({ id });

    if (!existingGoal) {
      return {
        success: false,
        message: ProjectGoalMessages.UPDATE.NOT_FOUND
      };
    }

    const changedFields: Record<string, any> = {};
    for (const key of Object.keys(updateData)) {
      if (updateData[key as keyof IProjectGoal] !== existingGoal[key as keyof IProjectGoal]) {
        changedFields[key] = updateData[key as keyof IProjectGoal];
      }
    }

    const updatedGoal = await updateProjectGoal(id, updateData);

    if (!updatedGoal) {
      return {
        success: false,
        message: ProjectGoalMessages.UPDATE.NOT_FOUND
      };
    }

    if (Object.keys(changedFields).length > 0) {
      await ProjectGoalUpdateHistory.create({
        goal_id: id,
        updated_by: userId,
        update_data: changedFields
      });
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
      message: error.message || ProjectGoalMessages.COMMENT.SUCCESS
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
      data: comments,
      message: ProjectGoalMessages.FETCH.SUCCESS
    };
  } catch (error: any) {
    return { success: false, message: error.message || ProjectGoalMessages.FETCH.FAILED_ALL };
  }
};

const updateProjectCommentService = async (
  commentId: string,
  updateData: Partial<IProjectComment>
): Promise<{ success: boolean; data?: IProjectComment | null; message?: string }> => {
  try {
    const updated = await updateProjectComment(commentId, updateData);
    return {
      success: true,
      data: updated,
      message: ProjectGoalMessages.UPDATE.SUCCESS
    };
  } catch (error: any) {
    return { success: false, message: error.message || ProjectGoalMessages.UPDATE.FAILED };
  }
};

const deleteProjectCommentService = async (
  commentId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const deleted = await deleteProjectComment(commentId);
    if (!deleted) {
      return { success: false, message: ProjectGoalMessages.DELETE.NOT_FOUND };
    }
    return { success: true, message: ProjectGoalMessages.DELETE.SUCCESS };
  } catch (error: any) {
    return { success: false, message: error.message || ProjectGoalMessages.DELETE.FAILED };
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
