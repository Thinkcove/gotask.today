// otp.routes.ts
import { requestOtp, verifyOtpHandler } from "./otp.controller";

export default [
  {
    method: "POST",
    path: "/otp/request",
    handler: requestOtp,
    options: { auth: false }
  },
  {
    method: "POST",
    path: "/otp/verify",
    handler: verifyOtpHandler,
    options: { auth: false }
  }
];
