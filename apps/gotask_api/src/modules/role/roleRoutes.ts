import Joi from "joi";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import RoleController from "./roleController";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import { permission } from "../../middleware/permission";
import authStrategy from "../../constants/auth/authStrategy";

const roleController = new RoleController();
const appName = APPLICATIONS.ROLE;
const tags = [API, "Role"];
const RoleRoutes = [];

// Route: Create Role
RoleRoutes.push({
  path: API_PATHS.CREATE_ROLE, // "/roles"
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, h: ResponseToolkit) =>
    roleController.createRole(new RequestHelper(request), h)
  ),
  options: {
    validate: {
      payload: Joi.object({
        name: Joi.string().required(),
        accessIds: Joi.array().items(Joi.string()).optional() //  array of access IDs
      })
    },
    notes: "Create a new role",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get All Roles
RoleRoutes.push({
  path: API_PATHS.GET_ALL_ROLES, // "/roles"
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, h: ResponseToolkit) =>
    roleController.getAllRoles(new RequestHelper(request), h)
  ),
  options: {
    notes: "Get all roles",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Get Role by ID
RoleRoutes.push({
  path: API_PATHS.GET_ROLE_BY_ID, //  "/roles/{id}"
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.VIEW, (request: Request, h: ResponseToolkit) =>
    roleController.getRoleById(new RequestHelper(request), h)
  ),
  options: {
    validate: {
      params: Joi.object({
        id: Joi.string().uuid().required()
      })
    },
    notes: "Get role by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Update Role
RoleRoutes.push({
  path: API_PATHS.UPDATE_ROLE, //  "/roles/{id}"
  method: API_METHODS.PUT,
  handler: permission(appName, ACTIONS.UPDATE, (request: Request, h: ResponseToolkit) =>
    roleController.updateRole(new RequestHelper(request), h)
  ),
  options: {
    validate: {
      params: Joi.object({
        id: Joi.string().uuid().required()
      }),
      payload: Joi.object({
        name: Joi.string().optional(),
        accessIds: Joi.array().items(Joi.string().uuid()).optional()
      })
    },
    notes: "Update role by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Delete Role
RoleRoutes.push({
  path: API_PATHS.DELETE_ROLE, // "/roles/{id}"
  method: API_METHODS.DELETE,
  handler: permission(appName, ACTIONS.DELETE, (request: Request, h: ResponseToolkit) =>
    roleController.deleteRole(new RequestHelper(request), h)
  ),
  options: {
    validate: {
      params: Joi.object({
        id: Joi.string().uuid().required()
      })
    },
    notes: "Delete role by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Remove Access from Role
RoleRoutes.push({
  path: `${API_PATHS.DLETE_ROLEACCESS}/{id}`,
  method: API_METHODS.DELETE,
  handler: permission(appName, ACTIONS.REVOKE_ACCESS, (request: Request, h: ResponseToolkit) =>
    roleController.removeAccessFromRole(new RequestHelper(request), h)
  ),
  options: {
    notes: "Remove specific access from a role",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

export default RoleRoutes;
