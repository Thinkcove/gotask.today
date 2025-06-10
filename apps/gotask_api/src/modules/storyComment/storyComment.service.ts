// src/modules/storyComment/storyComment.service.ts

import { StoryComment, IStoryComment } from "../../domain/model/storyComment/storyComment.model";
import mongoose from "mongoose";

export const addCommentService = async (data: {
  storyId: string;
  userId: string;
  comment: string;
}): Promise<IStoryComment> => {
  return await StoryComment.create({
    storyId: new mongoose.Types.ObjectId(data.storyId),
    userId: new mongoose.Types.ObjectId(data.userId),
    comment: data.comment,
  });
};

export const getCommentsByStoryService = async (
  storyId: string
): Promise<IStoryComment[]> => {
  return await StoryComment.find({ storyId }).sort({ createdAt: -1 });
};
