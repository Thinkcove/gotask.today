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
      const newUser = await resourceServices.createOrUpdateAssetTag(payload, user);
      return this.sendResponse(handler, newUser);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async getAllTags(requestHelper: RequestHelper, handler: any) {
    try {
      const tags = await resourceServices.getAllTags();
      return this.sendResponse(handler, tags);
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

  async getAllIssues(requestHelper: RequestHelper, handler: any) {
    try {
      const tags = await resourceServices.getAllIssues();
      return this.sendResponse(handler, tags);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async getTagById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const user = requestHelper.getUser();
      const asset = await resourceServices.getTagById(id, user);
      return this.sendResponse(handler, asset);
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default ResourceController;
