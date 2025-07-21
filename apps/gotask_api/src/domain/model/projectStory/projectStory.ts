import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ProjectStoryStatus, PROJECT_STORY_STATUS } from "../../../constants/projectStoryConstants";

export interface IProjectStory extends Document {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: ProjectStoryStatus;
}

const ProjectStorySchema = new Schema<IProjectStory>(
  {
    id: { type: String, default: uuidv4, unique: true },
    project_id: { type: String, required: true, ref: "Project", index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(PROJECT_STORY_STATUS),
      default: PROJECT_STORY_STATUS.TO_DO
    }
  },
  { timestamps: true }
);

export const ProjectStory = mongoose.model<IProjectStory>("ProjectStory", ProjectStorySchema);
