import { Document } from "mongoose";

export interface IRole extends Document {
  id: string;
  name: string;
  priority: number;
  access: string[];
}
export interface CreateRolePayload {
    name: string;
    priority: number;
    accessIds?: string[];
  }