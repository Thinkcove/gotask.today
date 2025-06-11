// export const getOtpEmailTemplate = (userName: string, otp: string) => {
//   return {
//     subject: "Your OTP Code",
//     text: `Hello ${userName},\n\nYour OTP is: ${otp}\nThis OTP will expire in 5 minutes.\n\nThank you,\nGoTask Team`
//   };
// };

export const getOtpEmailTemplate = (userName: string, otp: string) => {
  const subject = "🔐 Your One-Time Password (OTP)";

  const text = `Hi ${userName},

We received a request to verify your identity.

🔸 Your OTP Code: ${otp}
🔸 This code will expire in 5 minutes.

If you did not request this, please ignore this message or contact support immediately.

Thank you,  
GoTask Security Team`;

  return { subject, text };
};

