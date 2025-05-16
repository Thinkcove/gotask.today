import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { sendOtpService, verifyOtpService } from "./otpService";
import OtpMessages from "../../constants/apiMessages/OtpMessages";

class OtpController extends BaseController {
  // Send OTP to user
  async sendOtp(requestHelper: RequestHelper, handler: any) {
    try {
      const { user_id } = requestHelper.getPayload();

      if (!user_id) {
        return this.sendResponse(handler, {
          success: false,
          error: OtpMessages.SEND.MISSING_USER_ID
        });
      }

      const result = await sendOtpService(user_id);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Verify OTP
  async verifyOtp(requestHelper: RequestHelper, handler: any) {
    try {
      const { user_id, otp } = requestHelper.getPayload();

      if (!user_id || !otp) {
        return this.sendResponse(handler, {
          success: false,
          error: OtpMessages.VERIFY.MISSING_FIELDS
        });
      }

      const result = await verifyOtpService(user_id, otp);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default OtpController;
