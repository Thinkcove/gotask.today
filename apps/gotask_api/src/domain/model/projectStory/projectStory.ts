import { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

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
  comments: IProjectStoryComment[];
}

// Embedded Schema for Comments with timestamps
const ProjectStoryCommentSchema = new Schema<IProjectStoryComment>(
  {
    user_id: { type: String, required: true },
    comment: { type: String, required: true }
  },
  {
    _id: false,
    timestamps: true // Adds createdAt & updatedAt
  }
);

// Main Schema for Project Story
const ProjectStorySchema = new Schema<IProjectStory>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true
    },
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
    comments: [ProjectStoryCommentSchema]
  },
  { timestamps: true } // Adds createdAt & updatedAt for the story
);

// Exporting the Model
export const ProjectStory = mongoose.model<IProjectStory>("ProjectStory", ProjectStorySchema);
