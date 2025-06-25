import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { createPermissionService, deletePermissionService, getAllPermissionsService, getPermissionByIdService, getPermissionsWithFiltersService, updatePermissionService } from "./permissionServices";


class PermissionController extends BaseController {
  async createPermission(requestHelper: RequestHelper, handler: any) {
    try {
      const permissionData = requestHelper.getPayload();
      const user = requestHelper.getUser();
      
      if (!user || !user.id) {
        throw new Error("user ID not found");
      }

      const permissionDataWithUserId = {
        ...permissionData,
        user_id: user.id
      };

      const result = await createPermissionService(permissionDataWithUserId);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async getAllPermissions(requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getAllPermissionsService();
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async getPermissionsWithFilters(requestHelper: RequestHelper, handler: any) {
    try {
      const user = requestHelper.getUser();
      if (!user || !user.id) {
        throw new Error("user ID not found");
      }

      const filters = requestHelper.getPayload();
      const result = await getPermissionsWithFiltersService(filters);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async getPermissionById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const user = requestHelper.getUser();
      
      if (!user || !user.id) {
        throw new Error("user ID not found");
      }

      const result = await getPermissionByIdService(id);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async updatePermission(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const updateData = requestHelper.getPayload();
      const user = requestHelper.getUser();
      
      if (!user || !user.id) {
        throw new Error("user ID not found");
      }

      const existingPermission = await getPermissionByIdService(id);
      if (!existingPermission.success || !existingPermission.data) {
        return this.sendResponse(handler, {
          success: false,
          message: "Permission request not found",
          data: null
        });
      }

      const { ...updateDataWithoutUserId } = updateData;
      const result = await updatePermissionService(id, updateDataWithoutUserId);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async deletePermission(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const user = requestHelper.getUser();
      
      if (!user || !user.id) {
        throw new Error("user ID not found");
      }

      const existingPermission = await getPermissionByIdService(id);
      if (!existingPermission.success || !existingPermission.data) {
        return this.sendResponse(handler, {
          success: false,
          message: "Permission request not found",
          data: null
        });
      }

      const result = await deletePermissionService(id);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }
}

export default PermissionController;