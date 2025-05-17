import { User, IUser } from "../../domain/model/user/user";
import { Otp, IOtp } from "../../domain/model/otp/Otp"
import { sendEmail } from "../../constants/utils/emailService";
import { generateOTPWithExpiry } from "../../constants/utils/otpGenerator";
import UserMessages from "../../constants/apiMessages/userMessage";
import OtpMessages from "../../constants/apiMessages/OtpMessages";
import jwt from "jsonwebtoken";
import { getRoleByIdService } from "../role/roleService";
import { getOtpEmailTemplate } from "../../constants/utils/otpEmailTemplate";

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

    const { otp, otpExpiry } = generateOTPWithExpiry(5);

    await Otp.findOneAndUpdate(
      { user: user._id },
      { otp, otpExpiry },
      { upsert: true, new: true }
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
    return {
      success: false,
      message: error.message || OtpMessages.SEND.ERROR
    };
  }
};

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

    if (!user) {
      return {
        success: false,
        message: UserMessages.FETCH.NOT_FOUND
      };
    }

    const otpDoc = await Otp.findOne({ user: user._id }) as IOtp | null;

    if (!otpDoc) {
      return {
        success: false,
        message: OtpMessages.VERIFY.NOT_FOUND
      };
    }

    const now = new Date();

    if (otpDoc.otp !== enteredOtp) {
      return {
        success: false,
        message: OtpMessages.VERIFY.INVALID
      };
    }

    if (otpDoc.otpExpiry < now) {
      return {
        success: false,
        message: OtpMessages.VERIFY.EXPIRED
      };
    }

    await Otp.deleteOne({ user: user._id });

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

    const { password, ...sanitizedUser } = user.toObject();
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
