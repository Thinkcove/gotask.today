import { sign, verify } from "jsonwebtoken";
import { IUser } from "../../domain/model/user/user";

const authKey: string = process.env.AUTH_KEY!;

class Auth {
  static sign = (data: IUser) => sign(data, authKey);
  static verify = (token: string) => verify(token, authKey);
}

// src/types/auth.ts
export interface AuthCredentials {
  userId: string;
  role: string;
  email?: string;
}

export default Auth;
