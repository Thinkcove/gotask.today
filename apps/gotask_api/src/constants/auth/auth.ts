import { sign, verify } from "jsonwebtoken";
import { IUser } from "../../domain/model/user/user";

const authKey: string = process.env.AUTH_KEY!;

class Auth {
  static sign = (data: IUser) => sign(data, authKey);
  static verify = (token: string) => verify(token, authKey);
}

export default Auth;
