import Joi from "joi";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import RoleController from "./roleController";

const roleController = new RoleController();

const tags = [API, "Role"];
const RoleRoutes = [];

// Route: Create Role
RoleRoutes.push({
  path: API_PATHS.CREATE_ROLE, // "/roles"
  method: API_METHODS.POST,
  handler: (request: Request, h: ResponseToolkit) =>
    roleController.createRole(new RequestHelper(request), h),
  options: {
    validate: {
      payload: Joi.object({
        name: Joi.string().required(),
        priority: Joi.number().required(),
        accessIds: Joi.array().items(Joi.string()).optional() //  array of access IDs
      })
    },
    notes: "Create a new role",
    tags
  }
});

// Route: Get All Roles
RoleRoutes.push({
  path: API_PATHS.GET_ALL_ROLES, // "/roles"
  method: API_METHODS.GET,
  handler: (request: Request, h: ResponseToolkit) =>
    roleController.getAllRoles(new RequestHelper(request), h),
  options: {
    notes: "Get all roles",
    tags
  }
});

// Get Role by ID
RoleRoutes.push({
  path: API_PATHS.GET_ROLE_BY_ID, //  "/roles/{id}"
  method: API_METHODS.GET,
  handler: (request: Request, h: ResponseToolkit) =>
    roleController.getRoleById(new RequestHelper(request), h),
  options: {
    validate: {
      params: Joi.object({
        id: Joi.string().uuid().required()
      })
    },
    notes: "Get role by ID",
    tags
  }
});

// Update Role
RoleRoutes.push({
  path: API_PATHS.UPDATE_ROLE, //  "/roles/{id}"
  method: API_METHODS.PUT,
  handler: (request: Request, h: ResponseToolkit) =>
    roleController.updateRole(new RequestHelper(request), h),
  options: {
    validate: {
      params: Joi.object({
        id: Joi.string().uuid().required()
      }),
      payload: Joi.object({
        name: Joi.string().optional(),
        priority: Joi.number().optional(),
        accessIds: Joi.array().items(Joi.string().uuid()).optional()
      })
    },
    notes: "Update role by ID",
    tags
  }
});

// Delete Role
RoleRoutes.push({
  path: API_PATHS.DELETE_ROLE, // "/roles/{id}"
  method: API_METHODS.DELETE,
  handler: (request: Request, h: ResponseToolkit) =>
    roleController.deleteRole(new RequestHelper(request), h),
  options: {
    validate: {
      params: Joi.object({
        id: Joi.string().uuid().required()
      })
    },
    notes: "Delete role by ID",
    tags
  }
});

export default RoleRoutes;
