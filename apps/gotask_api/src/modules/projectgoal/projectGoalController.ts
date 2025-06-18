import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";

import {
  findGoalsByProjectId,
  findGoalsByUserId
} from "../../domain/interface/projectGoal/projectGoal";
import {
  createProjectGoalService,
  deleteProjectGoalService,
  getAllProjectGoalsService,
  getProjectGoalByIdService,
  updateProjectGoalService
} from "../projectgoal/projectGoalService";

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
  async getAllProjectGoals(_requestHelper: RequestHelper, handler: any) {
    try {
      const goals = await getAllProjectGoalsService();
      return this.sendResponse(handler, goals);
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
      return this.sendResponse(handler, goal);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Update a goal by ID
  async updateProjectGoal(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const updateData = requestHelper.getPayload();

      const updatedGoal = await updateProjectGoalService(id, updateData);
      if (!updatedGoal) throw new Error("Goal not found");

      return this.sendResponse(handler, updatedGoal);
    } catch (error) {
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
}

export default ProjectGoalController;
