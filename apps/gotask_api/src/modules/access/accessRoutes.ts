import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import AccessController from "./accessController";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";

const accessController = new AccessController();
const appName = APPLICATIONS.ACCESS;
const tags = [API, "Access"];
const AccessRoutes = [];

// POST - Create Access
AccessRoutes.push({
  path: API_PATHS.CREATE_ACCESS,
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, h: ResponseToolkit) =>
    accessController.createAccess(new RequestHelper(request), h)
  ),
  config: {
    notes: "Create a new access entry",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// GET - All Accesses
AccessRoutes.push({
  path: API_PATHS.GET_ACCESSES,
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, h: ResponseToolkit) =>
    accessController.getAllAccesses(new RequestHelper(request), h)
  ),
  config: {
    notes: "Get all access records",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// GET - Access by ID
AccessRoutes.push({
  path: API_PATHS.GET_ACCESS_BY_ID,
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.VIEW, (request: Request, h: ResponseToolkit) =>
    accessController.getAccessById(new RequestHelper(request), h)
  ),
  config: {
    notes: "Get access record by ID",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// PUT - Update Access
AccessRoutes.push({
  path: API_PATHS.UPDATE_ACCESS,
  method: API_METHODS.PUT,
  handler: permission(appName, ACTIONS.UPDATE, (request: Request, h: ResponseToolkit) =>
    accessController.updateAccess(new RequestHelper(request), h)
  ),
  config: {
    notes: "Update access record by ID",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// DELETE - Access by ID
AccessRoutes.push({
  path: API_PATHS.DELETE_ACCESS,
  method: API_METHODS.DELETE,
  handler: permission(appName, ACTIONS.DELETE, (request: Request, h: ResponseToolkit) =>
    accessController.deleteAccess(new RequestHelper(request), h)
  ),
  config: {
    notes: "Delete access record by ID",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// GET - Access Options (from static config or enum)
AccessRoutes.push({
  path: API_PATHS.GET_ACCESS_OPTIONS,
  method: API_METHODS.GET,
  handler: (request: Request, h: ResponseToolkit) =>
    accessController.getAccessOptions(new RequestHelper(request), h),
  config: {
    notes: "Get predefined access options from config",
    tags
  }
});

export default AccessRoutes;
