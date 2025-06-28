import { Request, ResponseToolkit } from "@hapi/hapi";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import authStrategy from "../../constants/auth/authStrategy";
import PermissionController from "./permissionController";

const permissionController = new PermissionController();
const tags = [API, "Permission"];

const PermissionRoutes = [];

// Create permission request
PermissionRoutes.push({
  path: "/permission",
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    permissionController.createPermission(new RequestHelper(request), handler),
  config: {
    notes: "Create a new permission request",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Get all permission requests
PermissionRoutes.push({
  path: "/getpermission",
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    permissionController.getAllPermissions(new RequestHelper(request), handler),
  config: {
    notes: "Get all permission requests",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Get permissions with filters
PermissionRoutes.push({
  path: "/permissionfilters",
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    permissionController.getPermissionsWithFilters(new RequestHelper(request), handler),
  config: {
    notes: "Get permission requests with filters (user_id, date, date range)",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Get permission by ID
PermissionRoutes.push({
  path: "/getpermissionbyid/{id}",
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    permissionController.getPermissionById(new RequestHelper(request), handler),
  config: {
    notes: "Get permission request by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Update permission request
PermissionRoutes.push({
  path: "/permission/{id}",
  method: API_METHODS.PUT,
  handler: (request: Request, handler: ResponseToolkit) =>
    permissionController.updatePermission(new RequestHelper(request), handler),
  config: {
    notes: "Update an existing permission request",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Delete permission request
PermissionRoutes.push({
  path: "/permission/{id}",
  method: API_METHODS.DELETE,
  handler: (request: Request, handler: ResponseToolkit) =>
    permissionController.deletePermission(new RequestHelper(request), handler),
  config: {
    notes: "Delete a permission request",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Create permission comment
PermissionRoutes.push({
  path: "/permission/comment",
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    permissionController.createPermissionComment(new RequestHelper(request), handler),
  config: {
    notes: "Add a comment to a permission request",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});
// Update permission comment
PermissionRoutes.push({
  path: "/permission/comment/{id}",
  method: API_METHODS.PUT,
  handler: (request: Request, handler: ResponseToolkit) =>
    permissionController.updatePermissionComment(new RequestHelper(request), handler),
  config: {
    notes: "Update a comment on a permission request",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});
// Delete permission comment
PermissionRoutes.push({
  path: "/permission/comment/{id}",
  method: API_METHODS.DELETE,
  handler: (request: Request, handler: ResponseToolkit) =>
    permissionController.deletePermissionComment(new RequestHelper(request), handler),
  config: {
    notes: "Delete a comment from a permission request",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

export default PermissionRoutes;
