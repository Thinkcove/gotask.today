import { Server } from "@hapi/hapi";
import { HTTP_METHODS, HttpMethod } from "../../constants/httpMethods";
import { API_PATHS } from "../../constants/apiPaths";
import {
  createAccess,
  getAllAccesses,
  getAccessById,
  updateAccess,
  deleteAccess,
} from "./accessController";

export const accessRoutes = (server: Server) => {
  server.route([
    {
      method: HTTP_METHODS.POST as HttpMethod,
      path: API_PATHS.CREATE_ACCESS, // /api/access
      handler: createAccess,
    },
    {
      method: HTTP_METHODS.GET as HttpMethod,
      path: API_PATHS.GET_ACCESSES, // /api/access
      handler: getAllAccesses,
    },
    {
      method: HTTP_METHODS.GET as HttpMethod,
      path: API_PATHS.GET_ACCESS_BY_ID, // /api/access/{id}
      handler: getAccessById,
    },
    {
      method: HTTP_METHODS.PUT as HttpMethod,
      path: API_PATHS.UPDATE_ACCESS, // /api/access/{id}
      handler: updateAccess,
    },
    {
      method: HTTP_METHODS.DELETE as HttpMethod,
      path: API_PATHS.DELETE_ACCESS, // /api/access/{id}
      handler: deleteAccess,
    },
  ]);
};
