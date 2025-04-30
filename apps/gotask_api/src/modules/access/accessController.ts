import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { IAccess } from "../../domain/model/access";
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
  // Create Access
  async createAccess(requestHelper: RequestHelper, handler: any) {
    try {
      const accessData = requestHelper.getPayload();
      console.log(JSON.stringify(accessData.name, null, 2));
      if (!accessData.name ) {
        console.log(accessData)
        return this.replyError(new Error(AccessMessages.CREATE.REQUIRED));
      }

      const newAccess = await createAccess(accessData);
      if (!newAccess.success) {
        return this.replyError(new Error(newAccess.message || AccessMessages.CREATE.FAILED));
      }

      return this.sendResponse(handler, newAccess.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get All Accesses
  async getAllAccesses(_requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getAllAccesses();
      if (!result.success) {
        return this.replyError(new Error(result.message || AccessMessages.FETCH.FAILED_ALL));
      }

      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get Access by ID
 // Get a specific access by ID
 async getAccessById(requestHelper: RequestHelper, handler: any) {
  try {
    const id = requestHelper.getParam("id");
    const result = await getAccessById(id);
    if (!result.success) {
      return this.replyError(new Error(result.message || AccessMessages.FETCH.FAILED_BY_ID));
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
        return this.replyError(new Error(result.message || AccessMessages.UPDATE.FAILED));
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
        return this.replyError(new Error(result.message || AccessMessages.DELETE.FAILED));
      }

      return this.sendResponse(handler, { message: AccessMessages.DELETE.SUCCESS });
    } catch (error) {
      return this.replyError(error);
    }
  }

  
  // Get Access Options from Config
  async getAccessOptions(requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getAccessOptionsFromConfig();
      if (!result.success) {
        return this.replyError(new Error(result.message || AccessMessages.CONFIG.LOAD_FAILED));
      }

      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  } 
}

export default AccessController;
