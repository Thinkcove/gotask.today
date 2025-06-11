import { Otp } from "../../model/otp/Otp";
import { IUser } from "../../model/user/user";
import {
  MAX_ATTEMPTS,
  RESEND_COOLDOWN_MINUTES,
} from "../../../constants/otp/otpConstants";

// ✅ Get existing OTP document for user
export const getExistingOtp = async (user: IUser) => {
  return await Otp.findOne({ user: user._id });
};

// ✅ Check if resend cooldown is active
export const isInCooldown = (resendCooldownExpiresAt?: Date): boolean => {
  if (!resendCooldownExpiresAt) return false;
  return resendCooldownExpiresAt > new Date();
};

// ✅ Used in resend logic — redundant with isInCooldown, but explicit for clarity
export const canResendOtp = (otpDoc: any, now: Date): boolean => {
  return otpDoc?.resendCooldownExpiresAt && otpDoc.resendCooldownExpiresAt > now;
};

// ✅ Save or update OTP
export const saveOrUpdateOtp = async (
  user: IUser,
  otp: string,
  otpExpiry: Date,
  now: Date
) => {
  return await Otp.findOneAndUpdate(
    { user: user._id },
    {
      otp,
      otpExpiry,
      isUsed: false,
      attemptsLeft: MAX_ATTEMPTS,
      resendCooldownExpiresAt: new Date(now.getTime() + RESEND_COOLDOWN_MINUTES * 60 * 1000),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

// ✅ Mark OTP as used
export const markOtpAsUsed = async (otpDoc: any) => {
  otpDoc.isUsed = true;
  await otpDoc.save();
};

// ✅ Handle invalid OTP attempts (returns false if locked out)
export const updateOtpAttempts = async (otpDoc: any) => {
  otpDoc.attemptsLeft = Math.max((otpDoc.attemptsLeft ?? MAX_ATTEMPTS) - 1, 0);
  await otpDoc.save();

  if (otpDoc.attemptsLeft <= 0) {
    await Otp.deleteOne({ _id: otpDoc._id });
    return false;
  }
  return true;
};

// ✅ Alternate invalid handler (returns true if exceeded)
export const handleInvalidOtp = async (otpDoc: any) => {
  otpDoc.attemptsLeft = Math.max((otpDoc.attemptsLeft ?? MAX_ATTEMPTS) - 1, 0);
  await otpDoc.save();

  if (otpDoc.attemptsLeft <= 0) {
    await Otp.deleteOne({ _id: otpDoc._id });
    return true; // Exceeded attempts
  }

  return false;
};

// ✅ Alias for clarity
export const findOtpByUser = async (user: IUser) => {
  return await Otp.findOne({ user: user._id });
};
