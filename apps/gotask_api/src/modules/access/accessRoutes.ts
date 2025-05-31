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

// Route: Create Access
AccessRoutes.push({
  path: API_PATHS.CREATE_ACCESS,
  method: API_METHODS.POST,
  handler: permission(
    appName,
    ACTIONS.CREATE,
    (request: Request, h: ResponseToolkit, restrictedFields: string[]) =>
      accessController.createAccess(new RequestHelper(request), h, restrictedFields)
  ),
  config: {
    notes: "Create a new access entry",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get All Accesses
AccessRoutes.push({
  path: API_PATHS.GET_ACCESSES,
  method: API_METHODS.GET,
  handler: permission(
    appName,
    ACTIONS.READ,
    (request: Request, h: ResponseToolkit) =>
      accessController.getAllAccesses(new RequestHelper(request), h)
  ),
  config: {
    notes: "Get all access records",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get Access by ID
AccessRoutes.push({
  path: API_PATHS.GET_ACCESS_BY_ID,
  method: API_METHODS.GET,
  handler: permission(
    appName,
    ACTIONS.VIEW,
    (request: Request, h: ResponseToolkit) =>
      accessController.getAccessById(new RequestHelper(request), h)
  ),
  config: {
    notes: "Get access by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Update Access
AccessRoutes.push({
  path: API_PATHS.UPDATE_ACCESS,
  method: API_METHODS.PUT,
  handler: permission(
    appName,
    ACTIONS.UPDATE,
    (request: Request, h: ResponseToolkit, restrictedFields: string[]) =>
      accessController.updateAccess(new RequestHelper(request), h, restrictedFields)
  ),
  config: {
    notes: "Update access by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Delete Access
AccessRoutes.push({
  path: API_PATHS.DELETE_ACCESS,
  method: API_METHODS.DELETE,
  handler: permission(
    appName,
    ACTIONS.DELETE,
    (request: Request, h: ResponseToolkit) =>
      accessController.deleteAccess(new RequestHelper(request), h)
  ),
  config: {
    notes: "Delete access by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get Access Options (No permission middleware here)
AccessRoutes.push({
  path: API_PATHS.GET_ACCESS_OPTIONS, // Assuming the path is defined in API_PATHS
  method: API_METHODS.GET,
  handler: (request: Request, h: ResponseToolkit) =>
    accessController.getAccessOptions(new RequestHelper(request), h),
  config: {
    notes: "Get access options from config",
    tags
  }
});

export default AccessRoutes;
