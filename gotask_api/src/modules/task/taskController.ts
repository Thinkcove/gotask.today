import { Request, ResponseToolkit } from "@hapi/hapi";
import { TaskService } from "./taskService";
import { errorResponse, successResponse } from "../../helpers/responseHelper";
import RequestHelper from "../../helpers/requestHelper";

// Create a Task
export const createTask = async (request: Request, h: ResponseToolkit) => {
  try {
    const requestHelper = new RequestHelper(request);
    const taskData = requestHelper.getPayload();
    if (!taskData) {
      return errorResponse(h, "Missing required fields", 400);
    }
    const newTask = await TaskService.createTask(taskData);
    return successResponse(h, newTask, 201);
  } catch (error) {
    return errorResponse(h, "Failed to create task", 500);
  }
};

// Get All Tasks
export const getAllTasks = async (_request: Request, h: ResponseToolkit) => {
  try {
    const tasks = await TaskService.getAllTasks();
    return successResponse(h, tasks);
  } catch (error) {
    return errorResponse(h, "Failed to retrieve tasks", 500);
  }
};

// Get tasks grouped by project with pagination
export const getTaskByProject = async (request: Request, h: ResponseToolkit) => {
  try {
    const { page, page_size } = request.payload as any;
    const result = await TaskService.getTaskByProject(Number(page), Number(page_size));
    return successResponse(h, result);
  } catch (error) {
    return errorResponse(h, "Failed to retrieve tasks by project", 500);
  }
};

// Get tasks grouped by user with pagination
export const getTaskByUser = async (request: Request, h: ResponseToolkit) => {
  try {
    const { page, page_size } = request.payload as any;
    const result = await TaskService.getTaskByUser(Number(page), Number(page_size));
    return successResponse(h, result);
  } catch (error) {
    return errorResponse(h, "Failed to retrieve tasks by user", 500);
  }
};

// Get task count by status
export const getTaskCountByStatus = async (_request: Request, h: ResponseToolkit) => {
  try {
    const taskCounts = await TaskService.getTaskCountByStatus();
    return successResponse(h, taskCounts);
  } catch (error) {
    return errorResponse(h, "Failed to retrieve task count by status", 500);
  }
};
