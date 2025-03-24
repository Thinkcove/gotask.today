import { Server } from "@hapi/hapi";
import {
  createTask,
  getAllTasks,
  getTaskByUser,
  getTaskByProject,
  getTaskCountByStatus,
  getTaskById,
  updateTask,
  createComment,
  updateComment,
} from "./taskController";
import { HTTP_METHODS } from "../../constants/httpMethods";
import { API_PATHS } from "../../constants/apiPaths";

export const taskRoutes = (server: Server) => {
  server.route([
    {
      method: HTTP_METHODS.POST,
      path: API_PATHS.CREATE_TASK,
      handler: createTask,
    },
    {
      method: HTTP_METHODS.GET,
      path: API_PATHS.GET_TASKS,
      handler: getAllTasks,
    },
    {
      method: HTTP_METHODS.POST, // Change to POST
      path: API_PATHS.GET_TASK_BY_PROJECT,
      handler: getTaskByProject,
    },
    {
      method: HTTP_METHODS.POST, // Change to POST
      path: API_PATHS.GET_TASK_BY_USER,
      handler: getTaskByUser,
    },
    {
      method: HTTP_METHODS.GET,
      path: API_PATHS.GET_TASK_COUNT_BY_STATUS,
      handler: getTaskCountByStatus,
    },
    {
      method: HTTP_METHODS.GET,
      path: API_PATHS.GET_TASK_BY_ID,
      handler: getTaskById,
    },
    {
      method: HTTP_METHODS.PUT,
      path: API_PATHS.UPDATE_TASK,
      handler: updateTask,
    },
    {
      method: HTTP_METHODS.POST,
      path: API_PATHS.CREATE_COMMENT,
      handler: createComment,
    },
    {
      method: HTTP_METHODS.PUT,
      path: API_PATHS.UPDATE_COMMENT,
      handler: updateComment,
    },
  ]);
};
