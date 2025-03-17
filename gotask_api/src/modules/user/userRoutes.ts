import { Server } from "@hapi/hapi";
import { HTTP_METHODS, HttpMethod } from "../../constants/httpMethods";
import { API_PATHS } from "../../constants/apiPaths";
import { createUser, getAllUsers } from "./userController";

export const userRoutes = (server: Server) => {
  server.route([
    {
      method: HTTP_METHODS.POST as HttpMethod,
      path: API_PATHS.CREATE_USER,
      handler: createUser,
    },
    {
      method: HTTP_METHODS.GET as HttpMethod,
      path: API_PATHS.GET_USERS,
      handler: getAllUsers,
    },
  ]);
};
