import { User } from "../../domain/model/user/user";
import { sendEmail } from "../../constants/utils/emailService";
import { generateOTP } from "../../constants/utils/otpGenerator";
import UserMessages from "../../constants/apiMessages/userMessage";
import OtpMessages from "../../constants/apiMessages/OtpMessages";
import { IUser } from "../../domain/model/user/user";  // Import IUser interface

/**
 * Send OTP to the user's registered email address (user_id is used as email)
 */
const sendOtpService = async (
  user_id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Fetch the user from the database by user_id
    const user = await User.findOne({ user_id }) as IUser;  // Cast to IUser interface

    if (!user) {
      return {
        success: false,
        message: UserMessages.FETCH.NOT_FOUND
      };
    }

    const otp = generateOTP(); // Generate a new OTP
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiration time (5 minutes from now)

    // Update user model with OTP and expiry time
    user.otp = otp;
    user.otpExpiry = otpExpires;
    await user.save();  // Save the user with the new OTP data

    // Send email with OTP (using user_id as the email address)
    await sendEmail({
      to: user.user_id,  // Use user_id as the email
      subject: "Your OTP Code",
      text: `Hello ${user.name},\n\nYour OTP is: ${otp}\nThis OTP will expire in 5 minutes.\n\nThank you.`
    });

    return {
      success: true,
      message: OtpMessages.SEND.SUCCESS
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || OtpMessages.SEND.ERROR
    };
  }
};

/**
 * Verify the OTP for the user
 */
const verifyOtpService = async (
  user_id: string,
  enteredOtp: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Fetch the user from the database by user_id
    const user = await User.findOne({ user_id }) as IUser;  // Cast to IUser interface

    if (!user || !user.otp || !user.otpExpiry) {
      return {
        success: false,
        message: OtpMessages.VERIFY.NOT_FOUND
      };
    }

    const now = new Date();

    // Check if entered OTP matches the stored OTP
    if (user.otp !== enteredOtp) {
      return {
        success: false,
        message: OtpMessages.VERIFY.INVALID
      };
    }

    // Check if the OTP has expired
    if (user.otpExpiry < now) {
      return {
        success: false,
        message: OtpMessages.VERIFY.EXPIRED
      };
    }

    // Clear OTP fields after successful verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return {
      success: true,
      message: OtpMessages.VERIFY.SUCCESS
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || OtpMessages.VERIFY.ERROR
    };
  }
};

export {
  sendOtpService,
  verifyOtpService
};
