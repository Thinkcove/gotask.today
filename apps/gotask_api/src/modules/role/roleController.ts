import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import {
  createRoleService,
  deleteRoleService,
  getAllRolesService,
  getRoleByIdService,
  updateRoleService
} from "./roleService";

class RoleController extends BaseController {
  // Create Role
  async createRole(requestHelper: RequestHelper, handler: any) {
    try {
      const roleData = requestHelper.getPayload();

      // Basic validation (optional here if you’re already using Joi at route-level)
      if (!roleData.name || roleData.priority === undefined) {
        return this.replyError(new Error("Name and Priority fields are required"));
      }

      const result = await createRoleService(roleData);
      if (!result.success) {
        return this.replyError(new Error(result.message || "Failed to create role"));
      }

      return this.sendResponse(handler, result.data); // Return HTTP 201 for created resource
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get All Roles
  async getAllRoles(_requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getAllRolesService();
      if (!result.success) {
        return this.replyError(new Error(result.message || "Failed to fetch roles"));
      }

      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get Role by ID
  async getRoleById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const result = await getRoleByIdService(id);

      if (!result.success) {
        return this.replyError(new Error(result.message || "Role not found"));
      }

      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Update Role
  async updateRole(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const updatedData = requestHelper.getPayload();

      const result = await updateRoleService(id, updatedData);
      if (!result.success) {
        return this.replyError(new Error(result.message || "Failed to update role"));
      }

      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Delete Role
  async deleteRole(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const result = await deleteRoleService(id);

      if (!result.success) {
        return this.replyError(new Error(result.message || "Failed to delete role"));
      }

      return this.sendSuccess(handler, "Role deleted successfully");
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default RoleController;
