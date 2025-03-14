import { Server } from "@hapi/hapi";
import { HTTP_METHODS, HttpMethod } from "../../constants/httpMethods";
import { API_PATHS } from "../../constants/apiPaths";
import { createTask, getAllTasks } from "./taskController";

export const taskRoutes = (server: Server) => {
  server.route([
    {
      method: HTTP_METHODS.POST as HttpMethod,
      path: API_PATHS.CREATETASKS,
      handler: createTask,
    },
    {
      method: HTTP_METHODS.GET as HttpMethod,
      path: API_PATHS.GET_TASK,
      handler: getAllTasks,
    },
  ]);
};
