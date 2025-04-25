import nodemailer from "nodemailer";
import UserMessages from "../apiMessages/userMessage";

// Generate a 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// Send OTP Email (Using nodemailer)
export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS // Your email password (use env variables for security)
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: UserMessages.OTP.OTP_TITLE,
    text: `${UserMessages.OTP.OTP_TITLE}: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(UserMessages.OTP.SEND_FAILED, error);
    throw new Error(UserMessages.OTP.SEND_FAILED);
  }
};
