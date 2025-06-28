import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IPermissionComment extends Document {
  id: string;
  permission_id: string;
  user_id: string;
  user_name: string;
  comment: string;
}

export const PermissionCommentSchema = new Schema(
  {
    id: { type: String, default: uuidv4 },
    permission_id: { type: String, required: true },
    user_id: { type: String, required: true },
    comment: { type: String, required: true }
  },
  { timestamps: true }
);

export const PermissionComment = mongoose.model<IPermissionComment>(
  "PermissionComment",
  PermissionCommentSchema
);
