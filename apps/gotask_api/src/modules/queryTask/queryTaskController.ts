import { Request, ResponseToolkit } from "@hapi/hapi";
import BaseController from "../../common/baseController";
import RequestHelper from "../../helpers/requestHelper";
import {
  createNewTaskService,
  deleteTaskService,
  getAllTasksService,
  getTaskByIdService,
  getTasksByProjectService,
  getTasksByUserService,
  getTaskCountByStatusService,
  updateTaskService,
  createCommentService,
  updateCommentService,
  addTimeSpentService,
  processTaskQuery
} from "./queryTaskService";

class QueryTaskController extends BaseController {
  async createTask(requestHelper: RequestHelper, handler: any) {
    try {
      const { user_id, project_id, created_on, due_date, ...rest } = requestHelper.getPayload();
      if (!user_id || !project_id || !created_on || !due_date) {
        throw new Error("Please provide user_id, project_id, created_on, and due_date.");
      }

      const result = await createNewTaskService({
        user_id,
        project_id,
        created_on: new Date(created_on),
        due_date: new Date(due_date),
        ...rest
      });
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async deleteTask(requestHelper: RequestHelper, handler: any) {
    try {
      const { id } = requestHelper.getParam("id");
      if (!id) {
        throw new Error("Please provide task id.");
      }

      const result = await deleteTaskService(id);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async getAllTasks(requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getAllTasksService();
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async getTaskById(requestHelper: RequestHelper, handler: any) {
    try {
      const { id } = requestHelper.getParam("id");
      if (!id) {
        throw new Error("Please provide task id.");
      }

      const result = await getTaskByIdService(id);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async getTasksByProject(requestHelper: RequestHelper, handler: any) {
    try {
      const { pipeline } = requestHelper.getPayload();
      if (!pipeline) {
        throw new Error("Please provide aggregation pipeline.");
      }

      const result = await getTasksByProjectService(pipeline);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async getTasksByUser(requestHelper: RequestHelper, handler: any) {
    try {
      const { pipeline } = requestHelper.getPayload();
      if (!pipeline) {
        throw new Error("Please provide aggregation pipeline.");
      }

      const result = await getTasksByUserService(pipeline);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async getTaskCountByStatus(requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getTaskCountByStatusService();
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async updateTask(requestHelper: RequestHelper, handler: any) {
    try {
      const { id, ...updateData } = requestHelper.getPayload();
      if (!id) {
        throw new Error("Please provide task id.");
      }

      const result = await updateTaskService(id, updateData);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async createComment(requestHelper: RequestHelper, handler: any) {
    try {
      const { task_id, user_id, comment, user_name } = requestHelper.getPayload();
      if (!task_id || !user_id || !comment || !user_name) {
        throw new Error("Please provide task_id, user_id, comment, and user_name.");
      }

      const result = await createCommentService({
        task_id,
        user_id,
        comment,
        user_name
      } as any);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async updateComment(requestHelper: RequestHelper, handler: any) {
    try {
      const { id, comment } = requestHelper.getPayload();
      if (!id || !comment) {
        throw new Error("Please provide comment id and new comment text.");
      }

      const result = await updateCommentService(id, { comment });
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async addTimeSpent(requestHelper: RequestHelper, handler: any) {
    try {
      const { id, timeEntries } = requestHelper.getPayload();
      if (!id || !timeEntries) {
        throw new Error("Please provide task id and time entries.");
      }

      const result = await addTimeSpentService(id, timeEntries);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async processTaskQuery(requestHelper: RequestHelper, handler: any) {
    try {
      const { query, parsedQuery } = requestHelper.getPayload();
      if (!query || !parsedQuery) {
        throw new Error("Query and parsedQuery are required.");
      }

      const result = await processTaskQuery(query, parsedQuery);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }
}

export default new QueryTaskController();
