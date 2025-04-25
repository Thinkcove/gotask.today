import { Document } from "mongoose";

export interface IAccess extends Document {
  id: string;
  name: string;
  application: {
    access: string;
    actions: string[];
  }[];
}
