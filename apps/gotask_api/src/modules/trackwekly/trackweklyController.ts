import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import {
  createWeeklyGoal,
  deleteWeeklyGoal,
  getAllWeeklyGoals,
  getWeeklyGoalById,
  updateWeeklyGoal
} from "./trackweklyService";
import {
  findGoalsByProjectIdNew,
  findGoalsByUserIdNew
} from "../../domain/interface/trackwekly/trackwekly";

class WeeklyGoalController extends BaseController {
  // Create a new weekly goal
  async createWeeklyGoal(requestHelper: RequestHelper, handler: any) {
    try {
      const goalData = requestHelper.getPayload();
      if (!goalData) throw new Error("Missing goal data");

      const newGoal = await createWeeklyGoal(goalData);
      return this.sendResponse(handler, newGoal);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get all weekly goals
  async getAllWeeklyGoals(_requestHelper: RequestHelper, handler: any) {
    try {
      const goals = await getAllWeeklyGoals();
      return this.sendResponse(handler, goals);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get a goal by ID
  async getWeeklyGoalById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      if (!id) throw new Error("Goal ID is required");

      const goal = await getWeeklyGoalById(id);
      return this.sendResponse(handler, goal);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Update a goal by ID
  async updateWeeklyGoal(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const updateData = requestHelper.getPayload();

      const updatedGoal = await updateWeeklyGoal(id, updateData);
      if (!updatedGoal) throw new Error("Goal not found");

      return this.sendResponse(handler, updatedGoal);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Delete a goal by ID
  async deleteWeeklyGoal(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const deletedGoal = await deleteWeeklyGoal(id);
      if (!deletedGoal) throw new Error("Goal not found");

      return this.sendResponse(handler, deletedGoal);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get goals by user ID
  async findWeeklyGoalsByUserId(requestHelper: RequestHelper, handler: any) {
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
  async findWeeklyGoalsByProjectId(requestHelper: RequestHelper, handler: any) {
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

export default WeeklyGoalController;
