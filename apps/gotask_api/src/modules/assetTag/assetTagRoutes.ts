import { Request, ResponseToolkit } from "@hapi/hapi";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import ResourceController from "./assetTagController";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";

const resourceController = new ResourceController();
const tags = [API, "Resource"];
const ResourceRoutes = [];

const appName = APPLICATIONS.ASSET;

// Route: Create Asset Tag
ResourceRoutes.push({
  path: "/createresource",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    resourceController.createAssetTag(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Create new Resource",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

ResourceRoutes.push({
  path: "/getAllTags",
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    resourceController.getAllTags(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Create new Resource",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

ResourceRoutes.push({
  path: "/createissues",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    resourceController.createAssetIssues(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Create new asset issues",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

ResourceRoutes.push({
  path: "/getallissues",
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    resourceController.getAllIssues(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get all issues",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

ResourceRoutes.push({
  path: "/getissuesbyid/{id}",
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    resourceController.getIssuesById(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get issues by id",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

ResourceRoutes.push({
  path: "/gettagbyid/{id}",
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    resourceController.getTagById(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get all issues",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

export default ResourceRoutes;
