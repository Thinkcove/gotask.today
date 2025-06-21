// domain/model/projectGoal/projectGoalComment.ts
import { v4 as uuidv4 } from "uuid";
import mongoose, { Schema } from "mongoose";

export interface IProjectComment extends Document {
  id: string;
  goal_id: string;
  user_id?: string;
  user_name?: string;
  comments: string[];
}

const ProjectCommentSchema = new Schema<IProjectComment>(
  {
    id: { type: String, default: uuidv4, unique: true },
    goal_id: { type: String, ref: "ProjectGoal", required: true },
    user_id: { type: String, ref: "User"},
    user_name: { type: String },
    comments: [{ type: String, required: true }]
  },
  { timestamps: true }
);

export const ProjectComment = mongoose.model<IProjectComment>(
  "ProjectComment",
  ProjectCommentSchema
);
