import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { IAccess } from "../../domain/model/access";
import {
  createAccess,
  getAllAccesses,
  getAccessById,
  updateAccess,
  deleteAccessById
} from "../access/accessService";

class AccessController extends BaseController {
  // Create Access
  async createAccess(requestHelper: RequestHelper, handler: any) {
    try {
      const accessData = requestHelper.getPayload();
      if (!accessData.name || !accessData.application) {
        return this.replyError(new Error("Name and Application fields are required"));
      }

      const newAccess = await createAccess(accessData);
      if (!newAccess.success) {
        return this.replyError(new Error(newAccess.message || "Failed to create access"));
      }

      return this.sendResponse(handler, newAccess.data); // Status code 201 for creation
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get All Accesses
  async getAllAccesses(_requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getAllAccesses();
      if (!result.success) {
        return this.replyError(new Error(result.message || "Failed to fetch accesses"));
      }

      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get Access by ID
  async getAccessById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const result = await getAccessById(id);
      if (!result.success) {
        return this.replyError(new Error(result.message || "Access not found"));
      }

      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Update Access
  async updateAccess(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const payload = requestHelper.getPayload() as Partial<IAccess>;
      const result = await updateAccess(id, payload);
      if (!result.success) {
        return this.replyError(new Error(result.message || "Failed to update access"));
      }

      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Delete Access
  async deleteAccess(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const result = await deleteAccessById(id);
      if (!result.success) {
        return this.replyError(new Error(result.message || "Failed to delete access"));
      }

      return this.sendResponse(handler, { message: "Access deleted successfully" });
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default AccessController;
