// models/otpModel.ts
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  expiresAt: { type: Number, required: true }
});

export const OTPModel = mongoose.model("OTP", otpSchema);
