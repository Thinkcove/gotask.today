import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { fetchUserPreferences, saveUserPreferences } from "./userPreferenceService";

class UserPreferenceController extends BaseController {
  // Set preferences
  async setUserPreferences(requestHelper: RequestHelper, handler: any) {
    try {
      const { user_id, preferences } = requestHelper.getPayload();
      const result = await saveUserPreferences(user_id, preferences);
      return this.sendResponse(handler, {
        success: true,
        data: result
      });
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Get preferences
  async getUserPreferences(requestHelper: RequestHelper, handler: any) {
    try {
      const { user_id } = requestHelper.getPayload();
      const result = await fetchUserPreferences(user_id);
      return this.sendResponse(handler, {
        success: true,
        data: result
      });
    } catch (error) {
      return this.replyError(error, handler);
    }
  }
}

export default UserPreferenceController;
