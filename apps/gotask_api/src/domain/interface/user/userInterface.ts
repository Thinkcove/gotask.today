import { Access } from "../../model/access";
import { User } from "../../model/user/user";
import { Document, Types } from "mongoose";

export interface IUser extends Document {
  id: string;
  name: string;
  password: string;
  user_id: string; // email
  status: boolean;
  roleId: Types.ObjectId;
  organization?: Types.ObjectId;
  projects?: Types.ObjectId[];
}
