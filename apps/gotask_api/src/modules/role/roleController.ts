import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { createRoleService, getAllRolesService } from "./roleService";

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

      return this.sendResponse(handler, result.data);
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
}

export default RoleController;
