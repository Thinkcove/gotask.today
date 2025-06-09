import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import jwt from "jsonwebtoken";
import { getRoleByIdService } from "../role/roleService";
import AssetMessages from "../../constants/apiMessages/userMessage";
import { comparePassword } from "../../constants/utils/common";
import assetServices from "./assetsServices";

class AssetController extends BaseController {
  async createAsset(requestHelper: RequestHelper, handler: any) {
    try {
      const payload = requestHelper.getPayload();

      if (!payload) {
        throw new Error(AssetMessages.CREATE.MISSING_FIELDS);
      }
      const newUser = await assetServices.createAsset(payload);
      return this.sendResponse(handler, newUser);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async getAssetById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const user = await assetServices.getAssetById(id);
      return this.sendResponse(handler, user);
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

  async deleteAsset(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const result = await assetServices.deleteAsset(id);
      if (!result.success) {
        return this.replyError(new Error(result.message));
      }

      return this.sendResponse(handler, { message: "Deleted Successful" });
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default AssetController;
