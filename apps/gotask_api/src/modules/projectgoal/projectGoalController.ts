import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";

import {
  findGoalsByProjectId,
  findGoalsByUserId
} from "../../domain/interface/projectGoal/projectGoal";
import {
  createProjectCommentService,
  createProjectGoalService,
  deleteProjectCommentService,
  deleteProjectGoalService,
  getAllProjectGoalsService,
  getCommentsByGoalIdService,
  getProjectGoalByIdService,
  updateProjectCommentService,
  updateProjectGoalService
} from "../projectgoal/projectGoalService";
import { ProjectGoalUpdateHistory } from "../../domain/model/projectGoal/projectGoalUpdateHistory";

class ProjectGoalController extends BaseController {
  // Create a new Project goal
  async createProjectGoal(requestHelper: RequestHelper, handler: any) {
    try {
      const goalData = requestHelper.getPayload();
      if (!goalData) throw new Error("Missing goal data");

      const newGoal = await createProjectGoalService(goalData);
      return this.sendResponse(handler, newGoal);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get all Project goals
  async getAllProjectGoals(requestHelper: RequestHelper, handler: any) {
    try {
      const filters = requestHelper.getPayload();
      const result = await getAllProjectGoalsService(filters);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get a goal by ID
  async getProjectGoalById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      if (!id) throw new Error("Goal ID is required");

      const goal = await getProjectGoalByIdService(id);
      if (!goal) throw new Error("Goal not found");

      // ✅ Get update history
      const updateHistory = await ProjectGoalUpdateHistory.find({ goal_id: id })
        .sort({ timestamp: -1 }) // latest first
        .lean()
        .exec();

      return this.sendResponse(handler, {
        goal,
        updateHistory
      });
    } catch (error) {
      console.error(`[ProjectGoal GetById] Error:`, error);
      return this.replyError(error);
    }
  }

  // Update a goal by ID
  async updateProjectGoal(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const updateData = requestHelper.getPayload();

      const userId = updateData.updated_by || requestHelper.getParam("user_id");

  

      delete updateData.updated_by;

      const updatedGoal = await updateProjectGoalService(id, updateData, userId);

      if (!updatedGoal) throw new Error("Goal not found");

      return this.sendResponse(handler, updatedGoal);
    } catch (error) {
      console.error(`[ProjectGoal Update] Error updating goal:`, error);
      return this.replyError(error);
    }
  }

  // Delete a goal by ID
  async deleteProjectGoal(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const deletedGoal = await deleteProjectGoalService(id);
      if (!deletedGoal) throw new Error("Goal not found");

      return this.sendResponse(handler, deletedGoal);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get goals by user ID
  async findProjectGoalsByUserId(requestHelper: RequestHelper, handler: any) {
    try {
      const userId = requestHelper.getParam("user_id");
      if (!userId) throw new Error("User ID is required");

      const goals = await findGoalsByUserId(userId);
      return this.sendResponse(handler, goals);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get goals by project ID
  async findProjectGoalsByProjectId(requestHelper: RequestHelper, handler: any) {
    try {
      const projectId = requestHelper.getParam("project_id");
      if (!projectId) throw new Error("Project ID is required");

      const goals = await findGoalsByProjectId(projectId);
      return this.sendResponse(handler, goals);
    } catch (error) {
      return this.replyError(error);
    }
  }
  // Create a new Project Comment
  async createComment(requestHelper: RequestHelper, handler: any) {
    try {
      const commentData = requestHelper.getPayload();
      const newComment = await createProjectCommentService(commentData);
      return this.sendResponse(handler, newComment);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }
  // Get comments for a goal
  async getCommentsByGoalId(requestHelper: RequestHelper, handler: any) {
    const goalId = requestHelper.getParam("goal_id");
    const result = await getCommentsByGoalIdService(goalId);
    return this.sendResponse(handler, result);
  }

  // Update comment
  async updateComment(requestHelper: RequestHelper, handler: any) {
    const commentId = requestHelper.getParam("comment_id");
    const updateData = requestHelper.getPayload();
    const result = await updateProjectCommentService(commentId, updateData);
    return this.sendResponse(handler, result);
  }

  // Delete comment
  async deleteComment(requestHelper: RequestHelper, handler: any) {
    const commentId = requestHelper.getParam("comment_id");
    const result = await deleteProjectCommentService(commentId);
    return this.sendResponse(handler, result);
  }
}

export default ProjectGoalController;
