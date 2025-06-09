import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IResource extends Document {
  id: string;
  empId: string;
  userId: string;
  assetId: string;
  erk?: string;
  previouslyUsedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    id: { type: String, default: uuidv4 },
    empId: { type: String, required: true },
    userId: { type: String, required: true, ref: "User" },
    assetId: { type: String, required: true, ref: "Asset" },
    erk: { type: String },
    previouslyUsedBy: { type: String }
  },
  {
    timestamps: true
  }
);

export const Resource = model<IResource>("Resource", ResourceSchema);
