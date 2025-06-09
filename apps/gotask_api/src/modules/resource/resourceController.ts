import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import jwt from "jsonwebtoken";
import { getRoleByIdService } from "../role/roleService";
import ResourceMessages from "../../constants/apiMessages/userMessage";
import { comparePassword } from "../../constants/utils/common";
import resourceServices from "./resourceService";

class ResourceController extends BaseController {
  async createResource(requestHelper: RequestHelper, handler: any) {
    try {
      const payload = requestHelper.getPayload();

      if (!payload) {
        throw new Error(ResourceMessages.CREATE.MISSING_FIELDS);
      }
      const newUser = await resourceServices.createAsset(payload);
      return this.sendResponse(handler, newUser);
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default ResourceController;
