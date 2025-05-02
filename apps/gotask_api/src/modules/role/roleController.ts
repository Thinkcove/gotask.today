import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import {
  createRoleService,
  deleteRoleService,
  getAllRolesService,
  getRoleByIdService,
  removeAccessFromRoleService,
  updateRoleService
} from "./roleService";
import { roleMessages } from "../../constants/apiMessages/roleMessages";

class RoleController extends BaseController {
  // Create Role
  async createRole(requestHelper: RequestHelper, handler: any) {
    try {
      const roleData = requestHelper.getPayload();

      if (!roleData.name) {
        return this.replyError(new Error(roleMessages.CREATE.FAILED)); // replaced with CREATE.FAILED
      }

      const result = await createRoleService(roleData);
      if (!result.success) {
        return this.replyError(new Error(result.message || roleMessages.CREATE.FAILED));
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
        return this.replyError(new Error(result.message || roleMessages.FETCH.FAILED));
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
        return this.replyError(new Error(result.message || roleMessages.FETCH.NOT_FOUND));
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
      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Delete Role
  async deleteRole(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      await deleteRoleService(id);
      return this.sendSuccess(handler, roleMessages.DELETE.SUCCESS);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Remove Access from Role
  async removeAccessFromRole(requestHelper: RequestHelper, handler: any) {
    try {
      const roleId = requestHelper.getParam("id");
      const { accessId } = requestHelper.getPayload();
      const result = await removeAccessFromRoleService(roleId, accessId);
      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default RoleController;
