// otp.service.ts
import { OtpModel } from "./otp.model";
import { generateOtp } from "./otp.utils";
import { getOtpTemplate } from "./otp.template";
import { getOtpConfig } from "./otp.config";
import nodemailer from "nodemailer";
import { AppError } from "../otp/otp.exceptions";

export const sendOtp = async (email: string, customerKey = "default") => {
  const config = getOtpConfig(customerKey);
  const otp = generateOtp(config.otpLength);
  const expiresAt = new Date(Date.now() + config.expiryMinutes * 60000);

  // Check resend limit
  const existing = await OtpModel.findOne({ email, customerKey });
  if (existing && existing.attempts >= config.maxAttempts) {
    throw new AppError("Max OTP attempts exceeded", 429);
  }

  await OtpModel.deleteMany({ email, customerKey }); // delete old OTPs

  await OtpModel.create({
    email,
    otp,
    expiresAt,
    customerKey,
    attempts: 1
  });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const html = getOtpTemplate(otp, config.language);

  await transporter.sendMail({
    from: config.emailSender,
    to: email,
    subject: "Your One-Time Password",
    html
  });

  return { success: true };
};

export const verifyOtp = async (
  email: string,
  otp: string,
  customerKey = "default"
) => {
  const otpRecord = await OtpModel.findOne({ email, otp, customerKey });

  if (!otpRecord) throw new AppError("Invalid OTP", 401);
  if (otpRecord.expiresAt < new Date()) {
    await OtpModel.deleteOne({ _id: otpRecord._id });
    throw new AppError("OTP expired", 401);
  }

  await OtpModel.deleteMany({ email, customerKey }); // OTP is one-time use
  return true;
};
