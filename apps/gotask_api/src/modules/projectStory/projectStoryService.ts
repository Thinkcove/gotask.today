import { ProjectStory, IProjectStory } from "../../domain/model/projectStory/projectStory";
import { Task } from "../../domain/model/task/task";
import { storyMessages } from "../../constants/apiMessages/projectStoryMessages";
import { buildStartsWithRegex } from "../../constants/utils/regex";

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
  search
}: {
  projectId: string;
  status?: string | string[];
  startDate?: string;
  search?: string;
}): Promise<IProjectStory[]> => {
  try {
    if (!projectId) {
      throw new Error(storyMessages.FETCH.PROJECT_ID_REQUIRED);
    }

    const query: any = { project_id: projectId };

    //  Use externalized regex function
    if (search) {
      query.title = { $regex: buildStartsWithRegex(search) };
    }

    if (status) {
      query.status = Array.isArray(status) ? { $in: status } : status;
    }

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(startDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    return await ProjectStory.find(query).sort({ createdAt: -1 });
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
