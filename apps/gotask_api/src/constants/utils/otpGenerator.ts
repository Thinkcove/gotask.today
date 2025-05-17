// utils/otpGenerator.ts

export const generateOTPWithExpiry = (
  expiryMinutes: number = 5
): { otp: string; otpExpiry: Date } => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const otpExpiry = new Date(Date.now() + expiryMinutes * 60 * 1000); // Expiration in minutes
  return { otp, otpExpiry };
};
