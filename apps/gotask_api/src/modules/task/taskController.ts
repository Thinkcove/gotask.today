import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { ITask } from "../../domain/model/task/task";
import { ITaskComment } from "../../domain/model/task/taskComment";
import {
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

class TaskController extends BaseController {
  // Create Task
  async createTask(requestHelper: RequestHelper, handler: any) {
    try {
      const taskData = requestHelper.getPayload();
      const newTask = await createTask(taskData);
      return this.sendResponse(handler, newTask);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  //delete task
  async deleteTask(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      await deleteTaskById(id);
      return this.sendResponse(handler, { message: "Task deleted successfully" });
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Get All Tasks
  async getAllTasks(_requestHelper: RequestHelper, handler: any) {
    try {
      const tasks = await getAllTasks();
      return this.sendResponse(handler, tasks);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Get Tasks by Project
  async getTaskByProject(requestHelper: RequestHelper, handler: any) {
    try {
      const {
        page,
        page_size,
        task_page,
        task_page_size,
        search_vals,
        search_vars,
        min_date,
        max_date,
        date_var
      } = requestHelper.getPayload();

      const result = await getTasksByProject(
        Number(page),
        Number(page_size),
        Number(task_page),
        Number(task_page_size),
        search_vals,
        search_vars,
        min_date,
        max_date,
        date_var
      );

      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Get Tasks by User
  async getTaskByUser(requestHelper: RequestHelper, handler: any) {
    try {
      const {
        page,
        page_size,
        task_page,
        task_page_size,
        search_vals,
        search_vars,
        min_date,
        max_date,
        date_var
      } = requestHelper.getPayload();

      const result = await getTasksByUser(
        Number(page),
        Number(page_size),
        Number(task_page),
        Number(task_page_size),
        search_vals,
        search_vars,
        min_date,
        max_date,
        date_var
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
  async getTaskById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const task = await getTaskById(id);
      return this.sendResponse(handler, task);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Update Task
  async updateTask(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const updateData = requestHelper.getPayload() as Partial<ITask>;
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
}

export default TaskController;
