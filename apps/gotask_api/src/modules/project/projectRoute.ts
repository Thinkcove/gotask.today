import { Server } from "@hapi/hapi";
import { HTTP_METHODS, HttpMethod } from "../../constants/httpMethods";
import { API_PATHS } from "../../constants/apiPaths";
import { createProject, getAllProjects } from "./projectController";

export const projectRoutes = (server: Server) => {
  server.route([
    {
      method: HTTP_METHODS.POST as HttpMethod,
      path: API_PATHS.CREATE_PROJECT,
      handler: createProject,
    },
    {
      method: HTTP_METHODS.GET as HttpMethod,
      path: API_PATHS.GET_PROJECTS,
      handler: getAllProjects,
    },
  ]);
};
