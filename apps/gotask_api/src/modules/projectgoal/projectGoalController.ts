import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import {
  createProjectGoal,
  deleteProjectGoal,
  getAllProjectGoals,
  getProjectGoalById,
  updateProjectGoal
} from "./projectGoalService";
import {
  findGoalsByProjectIdNew,
  findGoalsByUserIdNew
} from "../../domain/interface/projectGoal/projectGoal";

class ProjectGoalController extends BaseController {
  // Create a new Project goal
  async createProjectGoal(requestHelper: RequestHelper, handler: any) {
    try {
      const goalData = requestHelper.getPayload();
      if (!goalData) throw new Error("Missing goal data");

      const newGoal = await createProjectGoal(goalData);
      return this.sendResponse(handler, newGoal);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get all Project goals
  async getAllProjectGoals(_requestHelper: RequestHelper, handler: any) {
    try {
      const goals = await getAllProjectGoals();
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

      const goal = await getProjectGoalById(id);
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

      const updatedGoal = await updateProjectGoal(id, updateData);
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
      const deletedGoal = await deleteProjectGoal(id);
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

      const goals = await findGoalsByUserIdNew(userId);
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

      const goals = await findGoalsByProjectIdNew(projectId);
      return this.sendResponse(handler, goals);
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default ProjectGoalController;
