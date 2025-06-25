import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IProjectStoryComment extends Document {
  id: string;
  story_id: string;
  user_id: string;
  user_name: string;
  comment: string;
}

export const ProjectStoryCommentSchema = new Schema<IProjectStoryComment>(
  {
    id: { type: String, default: uuidv4 },
    story_id: { type: String, required: true },
    user_id: { type: String, required: true },
    user_name: { type: String },
    comment: { type: String, required: true }
  },
  { timestamps: true }
);

export const ProjectStoryComment = mongoose.model<IProjectStoryComment>(
  "ProjectStoryComment",
  ProjectStoryCommentSchema
);
