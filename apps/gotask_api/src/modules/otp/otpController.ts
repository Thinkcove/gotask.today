import jwt from "jsonwebtoken";
import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { sendOtpService, verifyOtpService } from "./otpService";
import OtpMessages from "../../constants/apiMessages/OtpMessages";
import { User } from "../../domain/model/user/user";
import { ResponseToolkit } from "@hapi/hapi";

class OtpController extends BaseController {
  // Send OTP to user
  async sendOtp(requestHelper: RequestHelper, handler: ResponseToolkit) {
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

  // Verify OTP and return JWT (no refresh token)
  async verifyOtp(requestHelper: RequestHelper, handler: ResponseToolkit) {
  try {
    const { user_id, otp, rememberMe } = requestHelper.getPayload();

    if (!user_id || !otp) {
      return this.sendResponse(handler, {
        success: false,
        error: OtpMessages.VERIFY.MISSING_FIELDS
      });
    }

    // Make sure rememberMe is a boolean, default false if missing
    const remember = rememberMe === true || rememberMe === "true";

    const result = await verifyOtpService(user_id, otp, remember);

    return this.sendResponse(handler, result);
  } catch (error) {
    return this.replyError(error);
  }
}


  // Remove the refreshToken method entirely since it's no longer needed
}

export default OtpController;
