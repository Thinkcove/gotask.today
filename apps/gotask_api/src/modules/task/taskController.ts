import { Request, ResponseToolkit } from "@hapi/hapi";
import { TaskService } from "./taskService";
import { errorResponse, successResponse } from "../../helpers/responseHelper";
import RequestHelper from "../../helpers/requestHelper";
import { ITask } from "../../domain/model/task/task";

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
    const { page, page_size, task_page, task_page_size, search_vals, search_vars } =
      request.payload as any;
    const result = await TaskService.getTaskByProject(
      Number(page),
      Number(page_size),
      Number(task_page),
      Number(task_page_size),
      search_vals,
      search_vars,
    );
    return successResponse(h, result);
  } catch (error) {
    return errorResponse(h, "Failed to retrieve tasks by project", 500);
  }
};

// Get tasks grouped by user with pagination
export const getTaskByUser = async (request: Request, h: ResponseToolkit) => {
  try {
    const { page, page_size, task_page, task_page_size, search_vals, search_vars } =
      request.payload as any;
    const result = await TaskService.getTaskByUser(
      Number(page),
      Number(page_size),
      Number(task_page),
      Number(task_page_size),
      search_vals,
      search_vars,
    );
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

// Get a Task by id
export const getTaskById = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const task = await TaskService.getTaskById(id);
    if (!task) return errorResponse(h, "Task not found", 404);
    return successResponse(h, task);
  } catch (error) {
    return errorResponse(h, "Failed to retrieve Task");
  }
};

// Update Task Details
export const updateTask = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const updatedData = request.payload as Partial<ITask>;
    const updatedTask = await TaskService.updateTask(id, updatedData);
    if (!updatedTask) return errorResponse(h, "Task not found", 404);
    return successResponse(h, updatedTask);
  } catch (error) {
    return errorResponse(h, "Failed to update Task details", 500);
  }
};
