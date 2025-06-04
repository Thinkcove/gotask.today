import jwt from "jsonwebtoken";
import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { sendOtpService, verifyOtpService } from "./otpService";
import OtpMessages from "../../constants/apiMessages/OtpMessages";
import { User } from "../../domain/model/user/user";
import { RefreshToken } from "../../domain/model/otp/refreshToken"; // <-- Import model
import { ResponseToolkit } from "@hapi/hapi";
import { Types } from "mongoose";

class OtpController extends BaseController {
  // Send OTP to user
  async sendOtp(requestHelper: RequestHelper, handler: ResponseToolkit) {
    try {
      const { user_id } = requestHelper.getPayload();

      if (!user_id) {
        return this.sendResponse(handler, {
          success: false,
          error: OtpMessages.SEND.MISSING_USER_ID,
        });
      }

      const result = await sendOtpService(user_id);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Verify OTP and return JWT + save refresh token in DB
  async verifyOtp(requestHelper: RequestHelper, handler: ResponseToolkit) {
    try {
      const { user_id, otp } = requestHelper.getPayload();

      if (!user_id || !otp) {
        return this.sendResponse(handler, {
          success: false,
          error: OtpMessages.VERIFY.MISSING_FIELDS,
        });
      }

      const result = await verifyOtpService(user_id, otp);

      // If verification failed, return early
      if (!result.success || !result.data) {
        return this.sendResponse(handler, result);
      }

      const user = await User.findOne({ user_id });
      if (!user) {
        return this.sendResponse(handler, {
          success: false,
          error: "User not found",
        });
      }

      // Save the refresh token in DB
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

      await RefreshToken.create({
        user: user._id,
        token: result.data.refreshToken,
        expiresAt,
        isRevoked: false,
      });

      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Refresh token endpoint - validate token in DB and revoke old token
  async refreshToken(requestHelper: RequestHelper, handler: ResponseToolkit) {
    try {
      const { refreshToken } = requestHelper.getPayload();

      if (!refreshToken) {
        return this.sendResponse(handler, {
          success: false,
          error: "Refresh token is required",
        });
      }

      let payload: any;
      try {
        payload = jwt.verify(
          refreshToken,
          process.env.REFRESH_AUTH_KEY as string
        );
      } catch (err) {
        return this.sendResponse(handler, {
          success: false,
          error: "Invalid or expired refresh token",
        });
      }

      // Find refresh token in DB
      const savedToken = await RefreshToken.findOne({ token: refreshToken });
      if (!savedToken || savedToken.isRevoked) {
        return this.sendResponse(handler, {
          success: false,
          error: "Refresh token revoked or not found",
        });
      }

      if (savedToken.expiresAt < new Date()) {
        return this.sendResponse(handler, {
          success: false,
          error: "Refresh token expired",
        });
      }

      const user = await User.findOne({ user_id: payload.user_id });
      if (!user) {
        return this.sendResponse(handler, {
          success: false,
          error: "User not found",
        });
      }

      // Revoke old refresh token
      savedToken.isRevoked = true;
      await savedToken.save();

      // Generate new tokens
      const accessToken = jwt.sign(
        {
          id: user._id as Types.ObjectId,
          user_id: user.user_id,
          role: user.roleId,
        },
        process.env.AUTH_KEY as string,
        { expiresIn: "15m" }
      );

      const newRefreshToken = jwt.sign(
        { user_id: user.user_id },
        process.env.REFRESH_AUTH_KEY as string,
        { expiresIn: "30d" }
      );

      // Save new refresh token in DB
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      await RefreshToken.create({
        user: user._id,
        token: newRefreshToken,
        expiresAt,
        isRevoked: false,
      });

      // Return new tokens
      return this.sendResponse(handler, {
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default OtpController;
