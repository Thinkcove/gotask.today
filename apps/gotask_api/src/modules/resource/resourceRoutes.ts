import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import ResourceController from "./resourceController";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";

const resourceController = new ResourceController();
const tags = [API, "Resource"];
const ResourceRoutes = [];

const appName = APPLICATIONS.RESOURCE;

// Route: Create Resource
ResourceRoutes.push({
  path: API_PATHS.CREATE_RESOURCE,
  method: API_METHODS.POST,
  // handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
  //   resourceController.createResource(new RequestHelper(request), handler)
  // ),
  handler: (request: Request, handler: ResponseToolkit) =>
    resourceController.createResource(new RequestHelper(request), handler),
  config: {
    notes: "Create new Resource",
    tags
    // auth: {
    //   strategy: authStrategy.SIMPLE
    // }
  }
});

export default ResourceRoutes;
