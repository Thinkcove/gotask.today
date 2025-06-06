import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import OtpController from "./otpController";

const otpController = new OtpController();

const tags = [API, "OTP"];
const OtpRoutes = [];

// Route: Send OTP
OtpRoutes.push({
  path: API_PATHS.SEND_OTP, // e.g., "/otp/send"
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    otpController.sendOtp(new RequestHelper(request), handler),
  config: {
    notes: "Send OTP to user's email",
    tags
  }
});

// Route: Verify OTP
OtpRoutes.push({
  path: API_PATHS.VERIFY_OTP, // e.g., "/otp/verify"
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    otpController.verifyOtp(new RequestHelper(request), handler),
  config: {
    notes: "Verify OTP submitted by user",
    tags
  }
});

// Route: Refresh Token
OtpRoutes.push({
  path: API_PATHS.REFRESH_TOKEN,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    otpController.refreshToken(new RequestHelper(request), handler),
  config: {
    notes: "Refresh access token using refresh token",
    tags
  }
});

export default OtpRoutes;
