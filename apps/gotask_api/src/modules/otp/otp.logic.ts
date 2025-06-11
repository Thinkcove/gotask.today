import { Otp } from "../../domain/model/otp/Otp";
import { IUser } from "../../domain/model/user/user";

const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MINUTES = 1;

export const getExistingOtp = async (user: IUser) => {
  return await Otp.findOne({ user: user._id });
};

export const canResendOtp = (otpDoc: any, now: Date): boolean => {
  return otpDoc?.resendCooldownExpiresAt && otpDoc.resendCooldownExpiresAt > now;
};

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
      resendCooldownExpiresAt: new Date(now.getTime() + RESEND_COOLDOWN_MINUTES * 60 * 1000)
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

export const findOtpByUser = async (user: IUser) => {
  return await Otp.findOne({ user: user._id });
};

export const markOtpAsUsed = async (otpDoc: any) => {
  otpDoc.isUsed = true;
  await otpDoc.save();
};

export const handleInvalidOtp = async (otpDoc: any) => {
  otpDoc.attemptsLeft = Math.max((otpDoc.attemptsLeft ?? MAX_ATTEMPTS) - 1, 0);
  await otpDoc.save();

  if (otpDoc.attemptsLeft <= 0) {
    await Otp.deleteOne({ _id: otpDoc._id });
    return true; // exceeded
  }

  return false;
};
