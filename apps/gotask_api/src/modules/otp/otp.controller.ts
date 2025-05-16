// otp.controller.ts
import { Request, ResponseToolkit } from "@hapi/hapi";
import { sendOtp, verifyOtp } from "./otp.service";
import { AppError } from "./otp.exceptions";

export const requestOtp = async (req: Request, h: ResponseToolkit) => {
  const { email, customerKey } = req.payload as any;

  try {
    await sendOtp(email, customerKey);
    return h.response({ message: "OTP sent successfully" }).code(200);
  } catch (err: unknown) {
    let status = 500;
    let message = "Something went wrong";

    if (err instanceof AppError) {
      status = err.statusCode;
      message = err.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    return h.response({ error: message }).code(status);
  }
};

export const verifyOtpHandler = async (req: Request, h: ResponseToolkit) => {
  const { email, otp, customerKey } = req.payload as any;

  try {
    await verifyOtp(email, otp, customerKey);
    return h.response({ message: "OTP verified successfully" }).code(200);
  } catch (err: unknown) {
    let status = 500;
    let message = "Something went wrong";

    if (err instanceof AppError) {
      status = err.statusCode;
      message = err.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    return h.response({ error: message }).code(status);
  }
};
