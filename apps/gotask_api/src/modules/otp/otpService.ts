import jwt from "jsonwebtoken";
import { User, IUser } from "../../domain/model/user/user";
import { Otp } from "../../domain/model/otp/Otp";
import { sendEmail } from "../../constants/utils/emailService";
import { generateOTPWithExpiry } from "../../constants/utils/otpGenerator";
import { getRoleByIdService } from "../role/roleService";
import { getOtpEmailTemplate } from "../../constants/utils/otpEmailTemplate";
import OtpMessages from "../../constants/apiMessages/OtpMessages";
import UserMessages from "../../constants/apiMessages/userMessage";

const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MINUTES = 1;

export const sendOtpService = async (
  user_id: string
): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    const user = (await User.findOne({ user_id })) as IUser;
    if (!user) {
      return { success: false, message: UserMessages.FETCH.NOT_FOUND };
    }

    const query = { user: user._id };
    const existingOtp = await Otp.findOne(query);
    const now = new Date();

    if (existingOtp?.resendCooldownExpiresAt && existingOtp.resendCooldownExpiresAt > now) {
      return {
        success: false,
        message: OtpMessages.SEND.RESEND_TOO_SOON
      };
    }

    const { otp, otpExpiry } = generateOTPWithExpiry(5);

    await Otp.findOneAndUpdate(
      query,
      {
        otp,
        otpExpiry,
        isUsed: false,
        attemptsLeft: MAX_ATTEMPTS,
        resendCooldownExpiresAt: new Date(now.getTime() + RESEND_COOLDOWN_MINUTES * 60 * 1000)
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const emailContent = getOtpEmailTemplate(user.name, otp);
    await sendEmail({
      to: user.user_id,
      subject: emailContent.subject,
      text: emailContent.text
    });

    return {
      success: true,
      message: OtpMessages.SEND.SUCCESS
    };
  } catch (error: any) {
    console.error("sendOtpService Error:", error);
    return {
      success: false,
      message: error.message || "OTP Service Error",
      details: error.stack
    };
  }
};

export const verifyOtpService = async (
  user_id: string,
  enteredOtp: string
): Promise<{
  success: boolean;
  message: string;
  data?: { token: string; refreshToken: string; user: Partial<IUser> };
  details?: any;
}> => {
  try {
    const user = (await User.findOne({ user_id }).populate("roleId")) as IUser;
    if (!user) {
      return { success: false, message: UserMessages.FETCH.NOT_FOUND };
    }

    const query = { user: user._id };
    const otpDoc = await Otp.findOne(query);
    const now = new Date();

    if (!otpDoc) {
      return { success: false, message: OtpMessages.VERIFY.NOT_FOUND };
    }

    if (otpDoc.isUsed) {
      return { success: false, message: OtpMessages.VERIFY.ALREADY_USED };
    }

    if (otpDoc.otpExpiry < now) {
      return { success: false, message: OtpMessages.VERIFY.EXPIRED };
    }

    if (otpDoc.otp !== enteredOtp) {
      otpDoc.attemptsLeft = Math.max((otpDoc.attemptsLeft ?? MAX_ATTEMPTS) - 1, 0);
      await otpDoc.save();

      if (otpDoc.attemptsLeft <= 0) {
        await Otp.deleteOne({ _id: otpDoc._id });
        return { success: false, message: OtpMessages.VERIFY.ATTEMPTS_EXCEEDED };
      }

      return { success: false, message: OtpMessages.VERIFY.INVALID };
    }

    // Mark OTP as used
    otpDoc.isUsed = true;
    await otpDoc.save();

    const roleId = user.roleId?.id?.toString();
    if (!roleId) {
      return { success: false, message: UserMessages.LOGIN.ROLE_NOT_FOUND };
    }

    const roleResult = await getRoleByIdService(roleId);
    if (!roleResult.success || !roleResult.data) {
      return {
        success: false,
        message: roleResult.message || UserMessages.LOGIN.ROLE_FETCH_FAILED
      };
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        user_id: user.user_id,
        role: roleResult.data
      },
      process.env.AUTH_KEY as string,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { user_id: user.user_id },
      process.env.REFRESH_AUTH_KEY as string,
      { expiresIn: "10m" }
    );

    const userObject = user.toObject();
    userObject.role = roleResult.data;

    return {
      success: true,
      message: OtpMessages.VERIFY.SUCCESS,
      data: {
        token: accessToken,
        refreshToken,
        user: userObject
      }
    };
  } catch (error: any) {
    console.error("verifyOtpService Error:", error);
    return {
      success: false,
      message: error.message || "OTP Service Error",
      details: error.stack
    };
  }
};
