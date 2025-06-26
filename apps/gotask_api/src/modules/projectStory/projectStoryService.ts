import { ProjectStory, IProjectStory } from "../../domain/model/projectStory/projectStory";
import { Task } from "../../domain/model/task/task";
import { storyMessages } from "../../constants/apiMessages/projectStoryMessages";
import { buildStartsWithRegex } from "../../constants/utils/regex";
import { getStartAndEndOfDay } from "../../constants/utils/date";
import {
  ProjectStoryComment,
  IProjectStoryComment
} from "../../domain/model/projectStory/projectStoryComment";

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

    // Search by title
    if (search) {
      query.title = { $regex: buildStartsWithRegex(search) };
    }

    // Filter by status
    if (status) {
      query.status = Array.isArray(status) ? { $in: status } : status;
    }

    // Filter by creation date range
    if (startDate) {
      const { start, end } = getStartAndEndOfDay(startDate);
      query.createdAt = { $gte: start, $lte: end };
    }

    return await ProjectStory.find(query).sort({ createdAt: -1 });
  } catch (error: any) {
    throw new Error(error.message || storyMessages.FETCH.FAILED);
  }
};

// GET a story by its UUID
export const getStoryByIdService = async (
  storyId: string
): Promise<(Omit<IProjectStory, keyof Document> & { comments: IProjectStoryComment[] }) | null> => {
  try {
    if (!storyId) {
      throw new Error("Story ID is required");
    }

    // Use .lean() to get a plain object
    const story = await ProjectStory.findOne({ id: storyId }).lean();

    if (!story) return null;

    const comments = await ProjectStoryComment.find({ story_id: storyId })
      .sort({ createdAt: -1 })
      .lean();

    return {
      ...story,
      comments
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch story by ID");
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
    if (!data.title && !data.description && !data.status) {
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

// COMMENT: Create a new comment
export const createCommentService = async (data: {
  story_id: string;
  user_id: string;
  user_name?: string;
  comment: string;
}): Promise<IProjectStoryComment> => {
  try {
    if (!data.story_id || !data.comment) {
      throw new Error(storyMessages.COMMENT.COMMENT_REQUIRED);
    }

    const newComment = new ProjectStoryComment({
      story_id: data.story_id,
      user_id: data.user_id,
      user_name: data.user_name,
      comment: data.comment
    });

    return await newComment.save();
  } catch (error: any) {
    throw new Error(error.message || storyMessages.COMMENT.FAILED);
  }
};

//  Update comment by ID
export const updateCommentService = async (
  commentId: string,
  updateData: { comment: string }
): Promise<IProjectStoryComment | null> => {
  try {
    if (!commentId || !updateData.comment) {
      throw new Error(storyMessages.COMMENT.COMMENT_REQUIRED);
    }

    const updated = await ProjectStoryComment.findOneAndUpdate(
      { id: commentId },
      { $set: { comment: updateData.comment, updatedAt: new Date() } },
      { new: true }
    );

    return updated;
  } catch (error: any) {
    throw new Error(error.message || storyMessages.COMMENT.UPDATE_FAILED);
  }
};

// COMMENT: Delete comment by ID
export const deleteCommentService = async (
  commentId: string
): Promise<IProjectStoryComment | null> => {
  try {
    const deleted = await ProjectStoryComment.findOneAndDelete({ id: commentId });
    return deleted;
  } catch (error: any) {
    throw new Error(error.message || storyMessages.COMMENT.DELETE_FAILED);
  }
};

// COMMENT: Get all comments for a story
export const getCommentsByStoryIdService = async (
  storyId: string
): Promise<IProjectStoryComment[]> => {
  try {
    return await ProjectStoryComment.find({ story_id: storyId }).sort({ createdAt: -1 });
  } catch (error: any) {
    throw new Error(error.message || storyMessages.COMMENT.FETCH_FAILED);
  }
};
