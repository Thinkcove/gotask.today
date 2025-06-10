// src/modules/storyComment/storyComment.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IStoryComment extends Document {
  storyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  comment: string;
  createdAt: Date;
}

const StoryCommentSchema = new Schema<IStoryComment>(
  {
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "ProjectStory",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const StoryComment = mongoose.model<IStoryComment>("StoryComment", StoryCommentSchema);
 