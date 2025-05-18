export const getOtpEmailTemplate = (userName: string, otp: string) => {
  return {
    subject: "Your OTP Code",
    text: `Hello ${userName},\n\nYour OTP is: ${otp}\nThis OTP will expire in 5 minutes.\n\nThank you,\nGoTask Team`
  };
};
