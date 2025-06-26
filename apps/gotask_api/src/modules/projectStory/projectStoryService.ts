import { ProjectStory, IProjectStory } from "../../domain/model/projectStory/projectStory";
import { Task } from "../../domain/model/task/task";
import { storyMessages } from "../../constants/apiMessages/projectStoryMessages";
import { buildStartsWithRegex } from "../../constants/utils/regex";
import { getStartAndEndOfDay } from "../../constants/utils/date";
import { Project } from "../../domain/model/project/project";
import { generateProjectStoryHistoryEntry } from "../../constants/utils/storyHistoryGenerator";
import { ProjectStoryHistory } from "../../domain/model/projectStory/projectStoryHistory";
import { v4 as uuidv4 } from "uuid";
import { ProjectStoryStatus } from "../../constants/projectStoryConstants";

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
}): Promise<{ stories: IProjectStory[]; projectName: string | null }> => {
  try {
    if (!projectId) {
      throw new Error(storyMessages.FETCH.PROJECT_ID_REQUIRED);
    }

    const query: any = { project_id: projectId };

    if (search) {
      query.title = { $regex: buildStartsWithRegex(search) };
    }

    if (status) {
      query.status = Array.isArray(status) ? { $in: status } : status;
    }

    if (startDate) {
      const { start, end } = getStartAndEndOfDay(startDate);
      query.createdAt = { $gte: start, $lte: end };
    }

    const stories = await ProjectStory.find(query).sort({ createdAt: -1 });

    // Get project name from Project model using the UUID
    const project = await Project.findOne({ id: projectId }).select("name");
    const projectName = project?.name || null;

    return { stories, projectName };
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
    loginuser_id?: string;
    loginuser_name?: string;
  }
): Promise<IProjectStory | null> => {
  try {
    const existingStory = await ProjectStory.findOne({ id: storyId });
    if (!existingStory) throw new Error(storyMessages.FETCH.NOT_FOUND);

    const { loginuser_id, loginuser_name, ...updateFields } = data;

    const updateData: Partial<IProjectStory> = {};
    if (updateFields.title) updateData.title = updateFields.title;
    if (updateFields.description) updateData.description = updateFields.description;
    if (updateFields.status) {
      updateData.status = updateFields.status as ProjectStoryStatus;
    }

    // Nothing to update?
    if (!Object.keys(updateData).length) {
      throw new Error(storyMessages.UPDATE.NO_FIELDS);
    }

    const historyEntry = generateProjectStoryHistoryEntry(existingStory, updateData);

    // Apply changes to story
    Object.assign(existingStory, updateData);

    // Log change in history if applicable
    if (historyEntry && loginuser_id) {
      const historyItem = new ProjectStoryHistory({
        id: uuidv4(),
        project_story_id: existingStory.id,
        loginuser_id,
        loginuser_name,
        formatted_history: historyEntry,
        created_date: new Date()
      });

      await historyItem.save();

      // Embed history into the story
      existingStory.history = existingStory.history || [];
      existingStory.history.unshift(historyItem);
    }

    // Save updated story
    await existingStory.save();

    return existingStory;
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
