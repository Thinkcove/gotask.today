import { User, IUser } from "../../domain/model/user/user";
import { Otp } from "../../domain/model/otp/Otp";
import { sendEmail } from "../../constants/utils/emailService";
import { generateOTPWithExpiry } from "../../constants/utils/otpGenerator";
import { getRoleByIdService } from "../role/roleService";
import { getOtpEmailTemplate } from "../../constants/utils/otpEmailTemplate";
import OtpMessages from "../../constants/apiMessages/OtpMessages";
import UserMessages from "../../constants/apiMessages/userMessage";

import { isInCooldown, updateOtpAttempts } from "./otp.helper";
import { generateOtpToken } from "./otp.token";
import { MAX_ATTEMPTS, RESEND_COOLDOWN_MINUTES } from "./otp.constants";

// ✅ SEND OTP
export const sendOtpService = async (user_id: string) => {
  const user = (await User.findOne({ user_id })) as IUser;
  if (!user) return { success: false, message: UserMessages.FETCH.NOT_FOUND };

  const query = { user: user._id };
  const existingOtp = await Otp.findOne(query);

  if (isInCooldown(existingOtp?.resendCooldownExpiresAt)) {
    return { success: false, message: OtpMessages.SEND.RESEND_TOO_SOON };
  }

  const { otp, otpExpiry } = generateOTPWithExpiry(5);
  const resendCooldown = new Date(Date.now() + RESEND_COOLDOWN_MINUTES * 60 * 1000);

  await Otp.findOneAndUpdate(
    query,
    {
      otp,
      otpExpiry,
      isUsed: false,
      attemptsLeft: MAX_ATTEMPTS,
      resendCooldownExpiresAt: resendCooldown
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const emailContent = getOtpEmailTemplate(user.name, otp);
  await sendEmail({
    to: user.user_id,
    subject: emailContent.subject,
    text: emailContent.text
  });

  return { success: true, message: OtpMessages.SEND.SUCCESS };
};

// ✅ VERIFY OTP
export const verifyOtpService = async (user_id: string, enteredOtp: string, rememberMe: boolean) => {
  const user = (await User.findOne({ user_id }).populate("roleId")) as IUser;
  if (!user) return { success: false, message: UserMessages.FETCH.NOT_FOUND };

  const otpDoc = await Otp.findOne({ user: user._id });
  if (!otpDoc) return { success: false, message: OtpMessages.VERIFY.NOT_FOUND };
  if (otpDoc.isUsed) return { success: false, message: OtpMessages.VERIFY.ALREADY_USED };
  if (otpDoc.otpExpiry < new Date()) return { success: false, message: OtpMessages.VERIFY.EXPIRED };

  if (otpDoc.otp !== enteredOtp) {
    const valid = await updateOtpAttempts(otpDoc);
    if (!valid) return { success: false, message: OtpMessages.VERIFY.ATTEMPTS_EXCEEDED };
    return { success: false, message: OtpMessages.VERIFY.INVALID };
  }

  otpDoc.isUsed = true;
  await otpDoc.save();

  const roleId = user.roleId?.id?.toString();
  if (!roleId) return { success: false, message: UserMessages.LOGIN.ROLE_NOT_FOUND };

  const roleResult = await getRoleByIdService(roleId);
  if (!roleResult.success || !roleResult.data)
    return { success: false, message: roleResult.message || UserMessages.LOGIN.ROLE_FETCH_FAILED };

  const accessToken = generateOtpToken(user, roleResult.data, rememberMe);

  const userObject = user.toObject();
  delete userObject.password;
  userObject.role = roleResult.data;

  return {
    success: true,
    message: OtpMessages.VERIFY.SUCCESS,
    data: { token: accessToken, user: userObject }
  };
};
