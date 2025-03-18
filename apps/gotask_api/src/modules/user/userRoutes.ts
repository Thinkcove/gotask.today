import { Server } from "@hapi/hapi";
import { HTTP_METHODS, HttpMethod } from "../../constants/httpMethods";
import { API_PATHS } from "../../constants/apiPaths";
import { createUser, getAllUsers, getUserById, updateUser } from "./userController";

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
    {
      method: HTTP_METHODS.GET as HttpMethod,
      path: API_PATHS.GET_USER_BY_ID,
      handler: getUserById,
    },
    {
      method: HTTP_METHODS.PUT as HttpMethod,
      path: API_PATHS.UPDATE_USER,
      handler: updateUser,
    },
  ]);
};
