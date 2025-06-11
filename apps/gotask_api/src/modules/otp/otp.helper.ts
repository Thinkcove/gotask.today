import { Otp } from "../../domain/model/otp/Otp";
import { MAX_ATTEMPTS, RESEND_COOLDOWN_MINUTES } from "./otp.constants";

// Check if resend is allowed
export const isInCooldown = (resendCooldownExpiresAt?: Date): boolean => {
  if (!resendCooldownExpiresAt) return false;
  return resendCooldownExpiresAt > new Date();
};

// Update OTP attempts on invalid entry
export const updateOtpAttempts = async (otpDoc: any) => {
  otpDoc.attemptsLeft = Math.max((otpDoc.attemptsLeft ?? MAX_ATTEMPTS) - 1, 0);
  await otpDoc.save();
  if (otpDoc.attemptsLeft <= 0) {
    await Otp.deleteOne({ _id: otpDoc._id });
    return false;
  }
  return true;
};
