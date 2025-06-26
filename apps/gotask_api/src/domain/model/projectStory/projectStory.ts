import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ProjectStoryStatus, PROJECT_STORY_STATUS } from "../../../constants/projectStoryConstants";
import { IProjectStoryHistory, ProjectStoryHistorySchema } from "./projectStoryHistory";

// Embedded Comment Schema Interface
interface IProjectStoryComment {
  user_id: string;
  comment: string;
}

// Project Story Interface
export interface IProjectStory extends Document {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: ProjectStoryStatus;
  comments: IProjectStoryComment[];
  history?: IProjectStoryHistory[]; // embedded story history
}

// Embedded Schema for Comments
const ProjectStoryCommentSchema = new Schema<IProjectStoryComment>(
  {
    user_id: { type: String, required: true },
    comment: { type: String, required: true }
  },
  {
    _id: false,
    timestamps: true
  }
);

// Project Story Schema with embedded history like Task
const ProjectStorySchema = new Schema<IProjectStory>(
  {
    id: { type: String, default: uuidv4, unique: true },
    project_id: {
      type: String,
      required: true,
      ref: "Project",
      index: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000
    },
    status: {
      type: String,
      enum: Object.values(PROJECT_STORY_STATUS),
      default: PROJECT_STORY_STATUS.TO_DO
    },
    comments: {
      type: [ProjectStoryCommentSchema],
      default: []
    },
    history: {
      type: [ProjectStoryHistorySchema],
      default: []
    }
  },
  { timestamps: true }
);

export const ProjectStory = mongoose.model<IProjectStory>("ProjectStory", ProjectStorySchema);
