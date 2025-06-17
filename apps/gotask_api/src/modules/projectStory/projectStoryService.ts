import { ProjectStory, IProjectStory } from "../../domain/model/projectStory/projectStory";

// CREATE a new story
export const createStoryService = async (data: {
  title: string;
  description?: string;
  projectId: string;
  createdBy: string;
}): Promise<IProjectStory> => {
  return await ProjectStory.create({
    title: data.title,
    description: data.description || "",
    project_id: data.projectId
  });
};

// GET all stories for a specific project by UUID
export const getStoriesByProjectService = async (projectId: string): Promise<IProjectStory[]> => {
  return await ProjectStory.find({ project_id: projectId }).sort({ createdAt: -1 });
};

// GET a story by its UUID
export const getStoryByIdService = async (storyId: string): Promise<IProjectStory | null> => {
  return await ProjectStory.findOne({ id: storyId });
};

// ADD a comment to a story using its UUID
export const addCommentToStory = async (
  storyId: string,
  commentData: {
    user_id: string;
    comment: string;
  }
): Promise<IProjectStory | null> => {
  return await ProjectStory.findOneAndUpdate(
    { id: storyId },
    {
      $push: {
        comments: {
          user_id: commentData.user_id,
          comment: commentData.comment,
          created_at: new Date()
        }
      }
    },
    { new: true }
  );
};

export const updateStoryService = async (
  storyId: string,
  data: {
    title?: string;
    description?: string;
  }
): Promise<IProjectStory | null> => {
  const updateData: any = {};
  if (data.title) updateData.title = data.title;
  if (data.description) updateData.description = data.description;

  return await ProjectStory.findOneAndUpdate({ id: storyId }, { $set: updateData }, { new: true });
};

export const deleteStoryService = async (storyId: string): Promise<boolean> => {
  const result = await ProjectStory.deleteOne({ id: storyId });
  return result.deletedCount > 0;
};
