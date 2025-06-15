import { ProjectStory, IProjectStory } from "../../domain/model/projectStory/projectStory";

// CREATE a new story
export const createStoryService = async (data: {
  title: string;
  description?: string;
  projectId: string;   // UUID of the project
  createdBy: string;   // UUID of the user creating the story
}): Promise<IProjectStory> => {
  return await ProjectStory.create({
    title: data.title,
    description: data.description || "",
    project_id: data.projectId,   // ✅ must match schema field name
    // you can store createdBy in comments or metadata later if needed
  });
};

// GET all stories for a specific project by UUID
export const getStoriesByProjectService = async (
  projectId: string
): Promise<IProjectStory[]> => {
  return await ProjectStory.find({ project_id: projectId }).sort({ createdAt: -1 }); // ✅ match schema
};

// GET a story by its UUID (not MongoDB _id)
export const getStoryByIdService = async (
  storyId: string
): Promise<IProjectStory | null> => {
  return await ProjectStory.findOne({ id: storyId }); // ✅ UUID-based search
};

// ADD a comment to a story using its UUID
export const addCommentToStoryService = async (
  storyId: string,
  commentData: {
    user_id: string;  // UUID of the commenter
    comment: string;
  }
): Promise<IProjectStory | null> => {
  return await ProjectStory.findOneAndUpdate(
    { id: storyId }, // ✅ match by UUID
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
