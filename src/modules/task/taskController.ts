import { Request, ResponseToolkit } from "@hapi/hapi";
import RequestHelper from "../../helpers/requestHelper";
import { errorResponse, successResponse } from "../../helpers/responseHelper";
import { TaskService } from "./taskService";

// Create a Task
export const createTask = async (request: Request, h: ResponseToolkit) => {
  try {
    const requestHelper = new RequestHelper(request);
    const taskData = requestHelper.getPayload();
    if (!taskData) {
      return errorResponse(h, "Invalid payload", 500);
    }
    const newTask = await TaskService.createTask(taskData);
    return successResponse(h, newTask, 200);
  } catch (error) {
    return errorResponse(h, "Failed to create task");
  }
};

// Get All Tasks
export const getAllTasks = async (_request: Request, h: ResponseToolkit) => {
  try {
    const tasks = await TaskService.getAllTasks();
    return successResponse(h, tasks);
  } catch (error) {
    return errorResponse(h, "Failed to retrieve tasks");
  }
};
