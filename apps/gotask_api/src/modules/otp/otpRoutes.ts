import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import OtpController from "./otpController";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";

const otpController = new OtpController();
const tags = [API, "OTP"];
const OtpRoutes = [];

const appName = APPLICATIONS.USER;

// Route: Send OTP
OtpRoutes.push({
  path: API_PATHS.SEND_OTP, // e.g., "/otp/send"
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    otpController.sendOtp(new RequestHelper(request), handler),
  config: {
    notes: "Send OTP to user's email or phone",
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

export default OtpRoutes;
