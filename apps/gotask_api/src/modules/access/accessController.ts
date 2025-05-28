import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import {
  createAccess,
  getAllAccesses,
  getAccessById,
  updateAccess,
  deleteAccessById,
  getAccessOptionsFromConfig,
} from "../access/accessService";
import AccessMessages from "../../constants/apiMessages/accessMessage";

class AccessController extends BaseController {
  async createAccess(requestHelper: RequestHelper, handler: any) {
    try {
      const accessData = requestHelper.getPayload();

      if (!accessData.name) {
        return this.replyError(new Error(AccessMessages.CREATE.REQUIRED));
      }

      // You may add validation for application/actions here if needed

      const result = await createAccess(accessData);

      if (!result.success) {
        return this.replyError(new Error(result.message || AccessMessages.CREATE.FAILED));
      }

      return this.sendResponse(handler, result.data);
    } catch (error: any) {
      return this.replyError(new Error(error.message || AccessMessages.CREATE.FAILED));
    }
  }

  async getAllAccesses(_requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getAllAccesses();

      if (!result.success) {
        return this.replyError(new Error(result.message || AccessMessages.FETCH.FAILED_ALL));
      }

      return this.sendResponse(handler, result.data);
    } catch (error: any) {
      return this.replyError(new Error(error.message || AccessMessages.FETCH.FAILED_ALL));
    }
  }

  async getAccessById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");

      const result = await getAccessById(id);

      if (!result.success) {
        return this.replyError(new Error(result.message || AccessMessages.FETCH.FAILED_BY_ID));
      }

      return this.sendResponse(handler, result.data);
    } catch (error: any) {
      return this.replyError(new Error(error.message || AccessMessages.FETCH.FAILED_BY_ID));
    }
  }

  async updateAccess(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const payload = requestHelper.getPayload();

      // Optional: Validate payload for application.actions format

      const result = await updateAccess(id, payload);

      if (!result.success) {
        return this.replyError(new Error(result.message || AccessMessages.UPDATE.FAILED));
      }

      return this.sendResponse(handler, result.data);
    } catch (error: any) {
      return this.replyError(new Error(error.message || AccessMessages.UPDATE.FAILED));
    }
  }

  async deleteAccess(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");

      const result = await deleteAccessById(id);

      if (!result.success) {
        return this.replyError(new Error(result.message || AccessMessages.DELETE.FAILED));
      }

      return this.sendResponse(handler, { message: AccessMessages.DELETE.SUCCESS });
    } catch (error: any) {
      return this.replyError(new Error(error.message || AccessMessages.DELETE.FAILED));
    }
  }

  async getAccessOptions(_requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getAccessOptionsFromConfig();

      if (!result.success) {
        return this.replyError(new Error(result.message || AccessMessages.CONFIG.LOAD_FAILED));
      }

      return this.sendResponse(handler, result.data);
    } catch (error: any) {
      return this.replyError(new Error(error.message || AccessMessages.CONFIG.LOAD_FAILED));
    }
  }
}

export default AccessController;
