import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import AssetMessages from "../../constants/apiMessages/userMessage";
import assetServices from "./assetsServices";

class AssetController extends BaseController {
  async createAsset(requestHelper: RequestHelper, handler: any) {
    try {
      const payload = requestHelper.getPayload();
      const user = requestHelper.getUser();
      if (!payload) {
        throw new Error(AssetMessages.CREATE.MISSING_FIELDS);
      }
      const newUser = await assetServices.createOrUpdateAsset(payload, user);
      return this.sendResponse(handler, newUser);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async createAssetType(requestHelper: RequestHelper, handler: any) {
    try {
      const payload = requestHelper.getPayload();
      const user = requestHelper.getUser();
      if (!payload) {
        throw new Error(AssetMessages.CREATE.MISSING_FIELDS);
      }
      const newUser = await assetServices.createAssetType(payload, user);
      return this.sendResponse(handler, newUser);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async getAssetById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const user = requestHelper.getUser();
      const asset = await assetServices.getAssetById(id, user);
      return this.sendResponse(handler, asset);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async getAllAssets(requestHelper: RequestHelper, handler: any) {
    try {
      const users = await assetServices.getAllAssets();
      return this.sendResponse(handler, users);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async getAllAssetsTypes(requestHelper: RequestHelper, handler: any) {
    try {
      const users = await assetServices.getAllAssetsTypes();
      return this.sendResponse(handler, users);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async deleteAsset(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const result = await assetServices.deleteAsset(id);
      if (!result.success) {
        return this.replyError(new Error(result.message));
      }

      return this.sendResponse(handler, { message: AssetMessages.DELETE.SUCCESS });
    } catch (error) {
      return this.replyError(error);
    }
  }

  async getAssetByUserId(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const user = requestHelper.getUser();
      const asset = await assetServices.getAssetByUserId(id, user);
      return this.sendResponse(handler, asset);
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default AssetController;
