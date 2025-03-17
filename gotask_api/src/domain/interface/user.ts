import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  user_id: string; // Email ID
  status: boolean; // true = active, false = inactive/blocked
  role: string;
}
