import { User } from "../../domain/model/user/user";
import { sendEmail } from "../../constants/utils/emailService";
import { generateOTP } from "../../constants/utils/otpGenerator";
import UserMessages from "../../constants/apiMessages/userMessage";
import OtpMessages from "../../constants/apiMessages/OtpMessages";
import { IUser } from "../../domain/model/user/user";
import jwt from "jsonwebtoken";
import { getRoleByIdService } from "../role/roleService";

/**
 * Send OTP to the user's registered email address (user_id is used as email)
 */
const sendOtpService = async (
  user_id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await User.findOne({ user_id }) as IUser;

    if (!user) {
      return {
        success: false,
        message: UserMessages.FETCH.NOT_FOUND
      };
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpires;
    await user.save();

    await sendEmail({
      to: user.user_id,
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
 * Verify the OTP and return JWT if successful
 */
const verifyOtpService = async (
  user_id: string,
  enteredOtp: string
): Promise<{
  success: boolean;
  message: string;
  data?: { token: string; user: Partial<IUser> };
}> => {
  try {
    const user = await User.findOne({ user_id }).populate("roleId") as IUser;

    if (!user || !user.otp || !user.otpExpiry) {
      return {
        success: false,
        message: OtpMessages.VERIFY.NOT_FOUND
      };
    }

    const now = new Date();

    if (user.otp !== enteredOtp) {
      return {
        success: false,
        message: OtpMessages.VERIFY.INVALID
      };
    }

    if (user.otpExpiry < now) {
      return {
        success: false,
        message: OtpMessages.VERIFY.EXPIRED
      };
    }

    // Clear OTP after verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const roleId = user.roleId?.id?.toString();
    if (!roleId) {
      return {
        success: false,
        message: UserMessages.LOGIN.ROLE_NOT_FOUND
      };
    }

    const roleResult = await getRoleByIdService(roleId);
    if (!roleResult.success || !roleResult.data) {
      return {
        success: false,
        message: roleResult.message || UserMessages.LOGIN.ROLE_FETCH_FAILED
      };
    }

    const enrichedRole = roleResult.data;

    const token = jwt.sign(
      {
        id: user.id,
        user_id: user.user_id,
        role: enrichedRole
      },
      process.env.AUTH_KEY as string,
      { expiresIn: "1h" }
    );

    const { password, otp, otpExpiry, ...sanitizedUser } = user.toObject();
    sanitizedUser.role = enrichedRole;

    return {
      success: true,
      message: OtpMessages.VERIFY.SUCCESS,
      data: {
        token,
        user: sanitizedUser
      }
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
