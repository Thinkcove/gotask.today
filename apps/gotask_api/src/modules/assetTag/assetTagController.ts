import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import ResourceMessages from "../../constants/apiMessages/userMessage";
import resourceServices from "./assetTagService";

class ResourceController extends BaseController {
  async createAssetTag(requestHelper: RequestHelper, handler: any) {
    try {
      const payload = requestHelper.getPayload();
      const user = requestHelper.getUser();
      if (!payload) {
        throw new Error(ResourceMessages.CREATE.MISSING_FIELDS);
      }
      const newUser = await resourceServices.createAssetTag(payload, user);
      return this.sendResponse(handler, newUser);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async createAssetIssues(requestHelper: RequestHelper, handler: any) {
    try {
      const payload = requestHelper.getPayload();
      const user = requestHelper.getUser();
      if (!payload) {
        throw new Error(ResourceMessages.CREATE.MISSING_FIELDS);
      }
      const newUser = await resourceServices.createOrUpdateAssetIssues(payload, user);
      return this.sendResponse(handler, newUser);
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default ResourceController;
