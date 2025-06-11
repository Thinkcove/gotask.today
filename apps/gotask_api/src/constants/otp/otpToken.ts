import jwt from "jsonwebtoken";
import { IUser } from "../../domain/model/user/user";

export const generateOtpToken = (
  user: IUser,
  role: any,
  rememberMe: boolean
): string => {
  const tokenExpiry = rememberMe ? "30s" : "30s"; // Adjust as needed
  return jwt.sign(
    {
      id: user.id,
      user_id: user.user_id,
      role
    },
    process.env.AUTH_KEY as string,
    { expiresIn: tokenExpiry }
  );
};
