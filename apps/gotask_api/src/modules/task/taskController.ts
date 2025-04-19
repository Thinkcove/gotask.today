import { Request, ResponseToolkit } from "@hapi/hapi";
import { TaskService } from "./taskService";
import { errorResponse, successResponse } from "../../helpers/responseHelper";
import RequestHelper from "../../helpers/requestHelper";
import { ITask } from "../../domain/model/task/task";
import { ITaskComment } from "../../domain/model/task/taskComment";
import { TimeUtil } from "../../constants/utils.ts/timeUtils";
import { ITimeSpentEntry } from "../../domain/model/task/task";

//Create a Task
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
      search_vars
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
      search_vars
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

export const addTimeSpent = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const payload = request.payload as ITimeSpentEntry | ITimeSpentEntry[];

    const timeEntries = Array.isArray(payload) ? payload : [payload];

    const formattedEntries: ITimeSpentEntry[] = [];

    for (const entry of timeEntries) {
      if (!entry || !entry.date || !entry.time_logged) {
        return errorResponse(h, "Missing required fields", 400);
      }

      const date = new Date(entry.date);
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;

      let formattedTime = "";
      const rawTime = entry.time_logged.trim();

      if (/^\d+:\d+$/.test(rawTime)) {
        const totalHours = TimeUtil.parseHourMinuteString(rawTime);
        formattedTime = TimeUtil.formatHoursToTimeString(totalHours);
      } else if (TimeUtil.isValidTimeFormat(rawTime)) {
        const totalHours = TimeUtil.parseTimeString(rawTime);
        formattedTime = TimeUtil.formatHoursToTimeString(totalHours);
      } else {
        return errorResponse(h, `Invalid time format: ${rawTime}`, 400);
      }

      formattedEntries.push({
        ...entry,
        date: formattedDate,
        time_logged: formattedTime
      });
    }

    const updatedTask = await TaskService.addTimeSpent(id, formattedEntries);
    if (!updatedTask) return errorResponse(h, "Task not found", 404);

    return successResponse(h, {
      time_spent: updatedTask.time_spent,
      estimated_time: updatedTask.estimated_time,
      remaining_time: updatedTask.remaining_time,
      time_spent_total: updatedTask.time_spent_total
    });
  } catch (error) {
    console.error("Error adding time spent:", error);
    return errorResponse(h, "Failed to add time spent", 500);
  }
};

export const updateEstimatedTime = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const { estimated_time } = request.payload as { estimated_time: string };

    if (!estimated_time) {
      return errorResponse(h, "Missing estimated time", 400);
    }

    const rawTime = estimated_time.trim();
    let formattedTime = "";

    if (/^\d+:\d+$/.test(rawTime)) {
      const totalHours = TimeUtil.parseHourMinuteString(rawTime);
      formattedTime = TimeUtil.formatHoursToTimeString(totalHours); // store in "XdYh"
    } else if (TimeUtil.isValidTimeFormat(rawTime)) {
      const totalHours = TimeUtil.parseTimeString(rawTime);
      formattedTime = TimeUtil.formatHoursToTimeString(totalHours);
    } else {
      return errorResponse(h, "Invalid time format. Use '2d4h', '3d', '6h' or 'H:MM'", 400);
    }

    const updatedTask = await TaskService.updateEstimatedTime(id, formattedTime);
    if (!updatedTask) return errorResponse(h, "Task not found", 404);

    return successResponse(h, updatedTask);
  } catch (error) {
    return errorResponse(h, "Failed to update estimated time", 500);
  }
};

export const getTimeTrackingSummary = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const summary = await TaskService.getTimeTrackingSummary(id);

    if (!summary) {
      return errorResponse(h, "Task not found", 404);
    }

    return successResponse(h, summary, 200);
  } catch (error) {
    return errorResponse(h, "Failed to fetch time tracking summary", 500);
  }
};

//Create a comment
export const createComment = async (request: Request, h: ResponseToolkit) => {
  try {
    const requestHelper = new RequestHelper(request);
    const commentData = requestHelper.getPayload();
    if (!commentData) {
      return errorResponse(h, "Missing required fields", 400);
    }
    const newComment = await TaskService.createComment(commentData);
    return successResponse(h, newComment, 201);
  } catch (error) {
    return errorResponse(h, "Failed to create comment", 500);
  }
};

//update a comment
export const updateComment = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params; // Get ID from URL
    const updatedData = request.payload as Partial<ITaskComment>;
    if (!updatedData) {
      return errorResponse(h, "Missing required fields", 400);
    }
    const updatedComment = await TaskService.updateComment(id, updatedData);
    if (!updatedComment) {
      return errorResponse(h, "Comment not found", 404);
    }
    return successResponse(h, updatedComment, 200);
  } catch (error) {
    console.error("Error updating comment:", error);
    return errorResponse(h, "Failed to update comment", 500);
  }
};
