// src/modules/projectStory/projectStory.service.ts

import { ProjectStory, IProjectStory } from "../../domain/model/projectStory/projectStory.model";
import mongoose from "mongoose";

export const createStory = async (data: {
  title: string;
  description: string;
  projectId: string;
  createdBy: string;
}): Promise<IProjectStory> => {
  return await ProjectStory.create({
    ...data,
    projectId: new mongoose.Types.ObjectId(data.projectId),
    createdBy: new mongoose.Types.ObjectId(data.createdBy),
  });
};

export const getStoriesByProject = async (
  projectId: string
): Promise<IProjectStory[]> => {
  return await ProjectStory.find({ projectId }).sort({ createdAt: -1 });
};

export const getStoryById = async (
  storyId: string
): Promise<IProjectStory | null> => {
  return await ProjectStory.findById(storyId);
};
