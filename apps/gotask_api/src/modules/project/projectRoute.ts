import { Server } from "@hapi/hapi";
import { HTTP_METHODS, HttpMethod } from "../../constants/httpMethods";
import { API_PATHS } from "../../constants/apiPaths";
import {
  assignUserToProject,
  createProject,
  getAllProjects,
  getProjectsByUserId,
} from "./projectController";

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
    {
      method: HTTP_METHODS.POST,
      path: API_PATHS.ASSIGN_USER_TO_PROJECT,
      handler: assignUserToProject,
    },
    {
      method: HTTP_METHODS.GET,
      path: API_PATHS.GET_PROJECT_BY_USERID,
      handler: getProjectsByUserId,
    },
  ]);
};
