import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import AccessController from "./accessController";

const accessController = new AccessController();

const tags = [API, "Access"];
const AccessRoutes = [];

// Route: Create Access
AccessRoutes.push({
  path: API_PATHS.CREATE_ACCESS,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    accessController.createAccess(new RequestHelper(request), handler),
  config: {
    notes: "Create a new access entry",
    tags
  }
});

// Route: Get All Accesses
AccessRoutes.push({
  path: API_PATHS.GET_ACCESSES,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    accessController.getAllAccesses(new RequestHelper(request), handler),
  config: {
    notes: "Get all access records",
    tags
  }
});

// Route: Get Access by ID
AccessRoutes.push({
  path: API_PATHS.GET_ACCESS_BY_ID,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    accessController.getAccessById(new RequestHelper(request), handler),
  config: {
    notes: "Get access by ID",
    tags
  }
});

// Route: Update Access
AccessRoutes.push({
  path: API_PATHS.UPDATE_ACCESS,
  method: API_METHODS.PUT,
  handler: (request: Request, handler: ResponseToolkit) =>
    accessController.updateAccess(new RequestHelper(request), handler),
  config: {
    notes: "Update access by ID",
    tags
  }
});

// Route: Delete Access
AccessRoutes.push({
  path: API_PATHS.DELETE_ACCESS,
  method: API_METHODS.DELETE,
  handler: (request: Request, handler: ResponseToolkit) =>
    accessController.deleteAccess(new RequestHelper(request), handler),
  config: {
    notes: "Delete access by ID",
    tags
  }
});

export default AccessRoutes;
