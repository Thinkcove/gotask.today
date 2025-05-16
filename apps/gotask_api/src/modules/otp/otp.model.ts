// otp.model.ts
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  customerKey: { type: String, default: "default" },
});

otpSchema.index({ email: 1, otp: 1 });

export const OtpModel = mongoose.model("Otp", otpSchema);
    