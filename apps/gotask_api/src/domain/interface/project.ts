import { Document } from "mongoose";

export interface IProject extends Document {
  id: string;
  name: string;
  description: string;
  status: string;
}
