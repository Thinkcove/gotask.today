import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { ITask } from "../../domain/model/task/task";
import { ITaskComment } from "../../domain/model/task/taskComment";
import {
  addTimeSpent,
  createComment,
  createTask,
  deleteTaskById,
  getAllTasks,
  getTaskById,
  getTaskCountByStatus,
  getTasksByProject,
  getTasksByUser,
  updateComment,
  updateTask
} from "./taskService";
import { ITimeSpentEntry } from "../../domain/model/task/timespent";

function filterRestrictedFields<T extends object>(data: T, restrictedFields: string[]): Partial<T> {
  const filteredData = { ...data };
  restrictedFields.forEach(field => {
    if (field in filteredData) {
      delete (filteredData as any)[field];
    }
  });
  return filteredData;
}

function filterRestrictedFieldsFromArray<T extends object>(items: T[], restrictedFields: string[]): Partial<T>[] {
  return items.map(item => filterRestrictedFields(item, restrictedFields));
}

class TaskController extends BaseController {
  // Create Task
  async createTask(requestHelper: RequestHelper, handler: any, restrictedFields: string[]) {
    try {
      let taskData = requestHelper.getPayload() as ITask;
      // Remove restricted fields from incoming payload
      if (restrictedFields.length > 0) {
        taskData = filterRestrictedFields(taskData, restrictedFields) as ITask;
      }
      const newTask = await createTask(taskData);
      return this.sendResponse(handler, newTask);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Delete Task
  async deleteTask(requestHelper: RequestHelper, handler: any, restrictedFields: string[]) {
    try {
      const id = requestHelper.getParam("id");
      await deleteTaskById(id);
      return this.sendResponse(handler, { message: "Task deleted successfully" });
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Get All Tasks
  async getAllTasks(_requestHelper: RequestHelper, handler: any, restrictedFields: string[]) {
    try {
      const response = await getAllTasks(); // expected { success, data?, message? }

      if (response.data && Array.isArray(response.data)) {
        const filteredTasks = filterRestrictedFieldsFromArray(response.data, restrictedFields);
        return this.sendResponse(handler, { ...response, data: filteredTasks });
      }

      // fallback if no data or data is not array
      return this.sendResponse(handler, response);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Get Tasks by Project (No field-level filtering assumed here)
  async getTaskByProject(requestHelper: RequestHelper, handler: any) {
    try {
      const {
        page,
        page_size,
        search_vals,
        search_vars,
        min_date,
        max_date,
        date_var,
        more_variation,
        less_variation,
        sort_field,
        sort_order
      } = requestHelper.getPayload();

      const result = await getTasksByProject(
        Number(page),
        Number(page_size),
        search_vals,
        search_vars,
        min_date,
        max_date,
        date_var,
        more_variation,
        less_variation,
        sort_field,
        sort_order
      );

      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Get Tasks by User (No field-level filtering assumed here)
  async getTaskByUser(requestHelper: RequestHelper, handler: any) {
    try {
      const {
        page,
        page_size,
        search_vals,
        search_vars,
        min_date,
        max_date,
        date_var,
        more_variation,
        less_variation,
        sort_field,
        sort_order
      } = requestHelper.getPayload();

      const result = await getTasksByUser(
        Number(page),
        Number(page_size),
        search_vals,
        search_vars,
        min_date,
        max_date,
        date_var,
        more_variation,
        less_variation,
        sort_field,
        sort_order
      );

      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Get Task Count by Status
  async getTaskCountByStatus(_requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getTaskCountByStatus();
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Get Task by ID
  async getTaskById(requestHelper: RequestHelper, handler: any, restrictedFields: string[]) {
    try {
      const id = requestHelper.getParam("id");
      const task = await getTaskById(id);

      if (task && typeof task === "object" && restrictedFields.length > 0) {
        const filteredTask = filterRestrictedFields(task, restrictedFields);
        return this.sendResponse(handler, filteredTask);
      }

      return this.sendResponse(handler, task);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Update Task
  async updateTask(requestHelper: RequestHelper, handler: any, restrictedFields: string[]) {
    try {
      const id = requestHelper.getParam("id");
      let updateData = requestHelper.getPayload() as Partial<ITask>;

      if (restrictedFields.length > 0) {
        // Remove restricted fields from update payload to prevent unauthorized changes
        updateData = filterRestrictedFields(updateData, restrictedFields) as Partial<ITask>;
      }

      const updatedTask = await updateTask(id, updateData);
      return this.sendResponse(handler, updatedTask);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Create Comment
  async createComment(requestHelper: RequestHelper, handler: any) {
    try {
      const commentData = requestHelper.getPayload();
      const newComment = await createComment(commentData);
      return this.sendResponse(handler, newComment);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Update Comment
  async updateComment(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const updateData = requestHelper.getPayload() as Partial<ITaskComment>;
      const updatedComment = await updateComment(id, updateData);
      return this.sendResponse(handler, updatedComment);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Add Time Spent to Task
  async addTimeSpent(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const timeEntries = requestHelper.getPayload() as ITimeSpentEntry | ITimeSpentEntry[];
      const result = await addTimeSpent(id, timeEntries);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }
}

export default TaskController;
