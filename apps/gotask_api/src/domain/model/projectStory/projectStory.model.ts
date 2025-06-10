// src/modules/projectStory/projectStory.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IProjectStory extends Document {
  title: string;
  description: string;
  projectId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectStorySchema = new Schema<IProjectStory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // handles createdAt and updatedAt
  }
);

export const ProjectStory = mongoose.model<IProjectStory>("ProjectStory", ProjectStorySchema);
