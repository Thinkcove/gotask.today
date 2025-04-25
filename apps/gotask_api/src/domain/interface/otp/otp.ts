import { OTPModel } from "../../model/otp/otp";

type OTPPayload = {
  user_id: string;
  otp?: string;
  expiresAt?: number;
};

// Store OTP
export const storeOTP = async (payload: OTPPayload) => {
  return OTPModel.create(payload);
};

// Retrieve OTP
export const retrieveOTP = async (
  payload: OTPPayload
): Promise<{ otp: string; expiresAt: number } | null> => {
  const doc = await OTPModel.findOne({ user_id: payload.user_id });
  return doc ? { otp: doc.otp, expiresAt: doc.expiresAt } : null;
};

// Clear OTP
export const clearOTP = async (payload: OTPPayload): Promise<void> => {
  await OTPModel.deleteOne({ user_id: payload.user_id });
};
