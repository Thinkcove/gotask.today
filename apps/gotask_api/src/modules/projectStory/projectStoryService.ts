import { ProjectStory, IProjectStory } from "../../domain/model/projectStory/projectStory";
import { Task } from "../../domain/model/task/task";
import { storyMessages } from "../../constants/apiMessages/projectStoryMessages";

// CREATE a new story
export const createStoryService = async (data: {
  title: string;
  description?: string;
  status?: string;
  projectId: string;
  createdBy: string;
}): Promise<IProjectStory> => {
  try {
    if (!data.title || !data.projectId) {
      throw new Error(storyMessages.CREATE.TITLE_REQUIRED);
    }

    return await ProjectStory.create({
      title: data.title,
      description: data.description || "",
      project_id: data.projectId,
      status: data.status || "to-do"
    });
  } catch (error: any) {
    throw new Error(error.message || storyMessages.CREATE.FAILED);
  }
};

// GET all stories for a specific project by UUID
export const getStoriesByProjectService = async ({
  projectId,
  status,
  startDate,
  endDate,
  page,
  limit
}: {
  projectId: string;
  status?: string | string[];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<IProjectStory[]> => {
  try {
    if (!projectId) {
      throw new Error(storyMessages.FETCH.PROJECT_ID_REQUIRED);
    }

    const query: any = { project_id: projectId };

    // Filter by status (single or multiple)
    if (status) {
      if (Array.isArray(status)) {
        query.status = { $in: status };
      } else {
        query.status = status;
      }
    }

    // Filter by createdAt range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = ((page || 1) - 1) * (limit || 10);

    return await ProjectStory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit || 10);
  } catch (error: any) {
    throw new Error(error.message || storyMessages.FETCH.FAILED);
  }
};


// GET a story by its UUID
export const getStoryByIdService = async (storyId: string): Promise<IProjectStory | null> => {
  try {
    if (!storyId) {
      throw new Error(storyMessages.FETCH.NOT_FOUND);
    }

    return await ProjectStory.findOne({ id: storyId });
  } catch (error: any) {
    throw new Error(error.message || storyMessages.FETCH.FAILED);
  }
};

// ADD a comment to a story
export const addCommentToStory = async (
  storyId: string,
  commentData: {
    user_id: string;
    comment: string;
  }
): Promise<IProjectStory | null> => {
  try {
    if (!storyId || !commentData.comment) {
      throw new Error(storyMessages.COMMENT.COMMENT_REQUIRED);
    }

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
  } catch (error: any) {
    throw new Error(error.message || storyMessages.COMMENT.FAILED);
  }
};

// UPDATE a story
export const updateStoryService = async (
  storyId: string,
  data: {
    title?: string;
    description?: string;
    status?: string;
  }
): Promise<IProjectStory | null> => {
  try {
    if (!data.title && !data.description) {
      throw new Error(storyMessages.UPDATE.NO_FIELDS);
    }

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.status) updateData.status = data.status;

    return await ProjectStory.findOneAndUpdate(
      { id: storyId },
      { $set: updateData },
      { new: true }
    );
  } catch (error: any) {
    throw new Error(error.message || storyMessages.UPDATE.FAILED);
  }
};

// DELETE a story
export const deleteStoryService = async (storyId: string): Promise<boolean> => {
  try {
    const result = await ProjectStory.deleteOne({ id: storyId });
    return result.deletedCount > 0;
  } catch (error: any) {
    throw new Error(error.message || storyMessages.DELETE.FAILED);
  }
};

// GET tasks linked to a story
export const getTasksByStoryId = async (storyId: string) => {
  try {
    if (!storyId) {
      throw new Error(storyMessages.TASK.FETCH_FAILED);
    }

    const tasks = await Task.find({ story_id: storyId }).sort({ created_on: -1 });
    return tasks;
  } catch (error: any) {
    throw new Error(error.message || storyMessages.TASK.FETCH_FAILED);
  }
};
