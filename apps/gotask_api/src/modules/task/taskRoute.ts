import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import TaskController from "./taskController";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import { permission } from "../../middleware/permission";
import authStrategy from "../../constants/auth/authStrategy";

const taskController = new TaskController();
const appName = APPLICATIONS.TASK;
const tags = [API, "Task"];
const TaskRoutes = [];

// Route: Create Task
TaskRoutes.push({
  path: API_PATHS.CREATE_TASK,
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    taskController.createTask(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Create a new task",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

//Route: Delete Task
TaskRoutes.push({
  path: `${API_PATHS.DELETE_TASK}/{id}`,
  method: API_METHODS.DELETE,
  handler: permission(appName, ACTIONS.DELETE, (request: Request, handler: ResponseToolkit) =>
    taskController.deleteTask(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Delete a task by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get All Tasks
TaskRoutes.push({
  path: API_PATHS.GET_TASKS,
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    taskController.getAllTasks(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Retrieve all tasks",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get Task by Project ID
TaskRoutes.push({
  path: API_PATHS.GET_TASK_BY_PROJECT,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    taskController.getTaskByProject(new RequestHelper(request), handler),
  config: {
    notes: "Retrieve tasks by project",
    tags
  }
});

// Route: Get Task by User ID
TaskRoutes.push({
  path: API_PATHS.GET_TASK_BY_USER,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    taskController.getTaskByUser(new RequestHelper(request), handler),
  config: {
    notes: "Retrieve tasks by user",
    tags
  }
});

// Route: Get Task Count by Status
TaskRoutes.push({
  path: API_PATHS.GET_TASK_COUNT_BY_STATUS,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    taskController.getTaskCountByStatus(new RequestHelper(request), handler),
  config: {
    notes: "Get task count grouped by status",
    tags
  }
});

// Route: Get Task by ID
TaskRoutes.push({
  path: API_PATHS.GET_TASK_BY_ID,
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.VIEW, (request: Request, handler: ResponseToolkit) =>
    taskController.getTaskById(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get a task by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Update Task
TaskRoutes.push({
  path: API_PATHS.UPDATE_TASK,
  method: API_METHODS.PUT,
  handler: permission(appName, ACTIONS.UPDATE, (request: Request, handler: ResponseToolkit) =>
    taskController.updateTask(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Update a task",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Create Comment
TaskRoutes.push({
  path: API_PATHS.CREATE_COMMENT,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    taskController.createComment(new RequestHelper(request), handler),
  config: {
    notes: "Add a comment to a task",
    tags
  }
});

// Route: Update Comment
TaskRoutes.push({
  path: API_PATHS.UPDATE_COMMENT,
  method: API_METHODS.PUT,
  handler: (request: Request, handler: ResponseToolkit) =>
    taskController.updateComment(new RequestHelper(request), handler),
  config: {
    notes: "Update a comment on a task",
    tags
  }
});

// Route: Add Time Spent
TaskRoutes.push({
  path: API_PATHS.ADD_TIME_SPENT,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    taskController.addTimeSpent(new RequestHelper(request), handler),
  config: {
    notes: "Add time spent on a task",
    tags
  }
});

export default TaskRoutes;
