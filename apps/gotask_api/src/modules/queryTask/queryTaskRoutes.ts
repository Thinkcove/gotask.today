import { Request, ResponseToolkit } from "@hapi/hapi";
import queryTaskController from "./queryTaskController";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";

const appName = APPLICATIONS.QUERY_TASK;
const tags = [API, "Query Task"];
const QueryTaskRoutes = [];

QueryTaskRoutes.push({
  path: "/api/tasks/create",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    queryTaskController.createTask(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Create a new task",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

QueryTaskRoutes.push({
  path: "/api/task/delete/{id}",
  method: API_METHODS.DELETE,
  handler: permission(appName, ACTIONS.DELETE, (request: Request, handler: ResponseToolkit) =>
    queryTaskController.deleteTask(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Delete a task by ID",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

QueryTaskRoutes.push({
  path: "/api/tasks/all",
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    queryTaskController.getAllTasks(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get all tasks",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

QueryTaskRoutes.push({
  path: "/api/tasks/{id}",
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    queryTaskController.getTaskById(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get a task by ID",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

QueryTaskRoutes.push({
  path: "/api/tasks/grouped-by-project",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    queryTaskController.getTasksByProject(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get tasks by project with aggregation pipeline",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

QueryTaskRoutes.push({
  path: "/api/task/{id}",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    queryTaskController.getTasksByUser(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get tasks by user with aggregation pipeline",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

QueryTaskRoutes.push({
  path: "/api/tasks/status-count",
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    queryTaskController.getTaskCountByStatus(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get task count grouped by status",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

QueryTaskRoutes.push({
  path: "/api/task/{id}",
  method: API_METHODS.PUT,
  handler: permission(appName, ACTIONS.UPDATE, (request: Request, handler: ResponseToolkit) =>
    queryTaskController.updateTask(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Update an existing task",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

QueryTaskRoutes.push({
  path: "/api/task/createcomment",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    queryTaskController.createComment(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Create a comment in a task",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

QueryTaskRoutes.push({
  path: "/api/task/update/{id}",
  method: API_METHODS.PUT,
  handler: permission(appName, ACTIONS.UPDATE, (request: Request, handler: ResponseToolkit) =>
    queryTaskController.updateComment(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Update a comment in a task",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

QueryTaskRoutes.push({
  path: "/api/tasklog/{id}",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.UPDATE, (request: Request, handler: ResponseToolkit) =>
    queryTaskController.addTimeSpent(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Add time spent to a task",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

QueryTaskRoutes.push({
  path: "/api/tasks/query",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    queryTaskController.processTaskQuery(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Process task-related query",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

export default QueryTaskRoutes;
