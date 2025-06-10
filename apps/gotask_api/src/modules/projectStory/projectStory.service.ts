import { ProjectStory, IProjectStory } from "../../domain/model/projectStory/projectStory.model";
import mongoose from "mongoose";

export const createStoryService = async (data: {
  title: string;
  description?: string;
  projectId: string;
  createdBy: string;
}): Promise<IProjectStory> => {
  return await ProjectStory.create({
    ...data,
    projectId: new mongoose.Types.ObjectId(data.projectId),
    createdBy: new mongoose.Types.ObjectId(data.createdBy)
  });
};

export const getStoriesByProjectService = async (
  projectId: string
): Promise<IProjectStory[]> => {
  return await ProjectStory.find({ projectId }).sort({ createdAt: -1 });
};

export const getStoryByIdService = async (
  storyId: string
): Promise<IProjectStory | null> => {
  return await ProjectStory.findById(storyId);
};
