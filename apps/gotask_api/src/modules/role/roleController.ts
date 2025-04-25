import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import {
  createRoleService,
  deleteRoleService,
  getAllRolesService,
  getRoleByIdService,
  updateRoleService
} from "./roleService";
import { roleMessages } from "../../constants/apiMessages/roleMessages";

class RoleController extends BaseController {
  // Create Role
  async createRole(requestHelper: RequestHelper, handler: any) {
    try {
      const roleData = requestHelper.getPayload();

      if (!roleData.name || roleData.priority === undefined) {
        return this.replyError(new Error(roleMessages.namePriorityRequired));
      }

      const result = await createRoleService(roleData);
      if (!result.success) {
        return this.replyError(new Error(result.message || roleMessages.createRoleFailed));
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
        return this.replyError(new Error(result.message || roleMessages.fetchRolesFailed));
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
        return this.replyError(new Error(result.message || roleMessages.roleNotFound));
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
        return this.replyError(new Error(result.message || roleMessages.updateRoleFailed));
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
        return this.replyError(new Error(result.message || roleMessages.deleteRoleFailed));
      }

      return this.sendSuccess(handler, roleMessages.deleteRoleSuccess);
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default RoleController;
