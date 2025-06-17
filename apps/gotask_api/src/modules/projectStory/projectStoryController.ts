import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import {
  createStoryService,
  getStoriesByProjectService,
  getStoryByIdService,
  addCommentToStory,
  updateStoryService,
  deleteStoryService,
  getTasksByStoryId
} from "./projectStoryService";
import { storyMessages } from "../../constants/apiMessages/projectStoryMessages";
import { createTask } from "../task/taskService";
import taskMessages from "../../constants/apiMessages/taskMessage";

class ProjectStoryController extends BaseController {
  async createStory(requestHelper: RequestHelper, handler: any) {
    try {
      const { title, description } = requestHelper.getPayload() || {};
      const { projectId } = requestHelper.getAllParams();
      const user = requestHelper.getUser();
      const userId = user?.id;

      if (!title) {
        return this.replyError(new Error(storyMessages.CREATE.TITLE_REQUIRED));
      }

      const story = await createStoryService({
        title,
        description,
        projectId,
        createdBy: userId
      });

      return this.sendResponse(handler, {
        message: storyMessages.CREATE.SUCCESS,
        data: story
      });
    } catch (err: any) {
      return this.replyError(err);
    }
  }

  async getStoriesByProject(requestHelper: RequestHelper, handler: any) {
    try {
      const { projectId } = requestHelper.getAllParams();
      const stories = await getStoriesByProjectService(projectId);

      return this.sendResponse(handler, {
        message: storyMessages.FETCH.ALL_SUCCESS,
        data: stories
      });
    } catch (err: any) {
      return this.replyError(err);
    }
  }

  async getStoryById(requestHelper: RequestHelper, handler: any) {
    try {
      const { storyId } = requestHelper.getAllParams();
      const story = await getStoryByIdService(storyId);

      if (!story) {
        return this.replyError(new Error(storyMessages.FETCH.NOT_FOUND));
      }

      return this.sendResponse(handler, {
        message: storyMessages.FETCH.SINGLE_SUCCESS,
        data: story
      });
    } catch (err: any) {
      return this.replyError(err);
    }
  }

  async addComment(requestHelper: RequestHelper, handler: any) {
    try {
      const { comment } = requestHelper.getPayload();
      const { storyId } = requestHelper.getAllParams();
      const user = requestHelper.getUser();
      const userId = user?.id;

      if (!comment) {
        return this.replyError(new Error(storyMessages.COMMENT.COMMENT_REQUIRED));
      }

      const updatedStory = await addCommentToStory(storyId, {
        user_id: userId,
        comment
      });

      return this.sendResponse(handler, {
        message: storyMessages.COMMENT.SUCCESS,
        data: updatedStory
      });
    } catch (err: any) {
      return this.replyError(err);
    }
  }
  async updateStory(requestHelper: RequestHelper, handler: any) {
    try {
      const { storyId } = requestHelper.getAllParams();
      const { title, description } = requestHelper.getPayload();

      if (!title && !description) {
        return this.replyError(new Error(storyMessages.UPDATE.NO_FIELDS));
      }

      const updatedStory = await updateStoryService(storyId, {
        title,
        description
      });

      if (!updatedStory) {
        return this.replyError(new Error(storyMessages.FETCH.NOT_FOUND));
      }

      return this.sendResponse(handler, {
        message: storyMessages.UPDATE.SUCCESS,
        data: updatedStory
      });
    } catch (err: any) {
      return this.replyError(err);
    }
  }

  async deleteStory(requestHelper: RequestHelper, handler: any) {
    try {
      const { storyId } = requestHelper.getAllParams();

      const deleted = await deleteStoryService(storyId);
      if (!deleted) {
        return this.replyError(new Error(storyMessages.FETCH.NOT_FOUND));
      }

      return this.sendResponse(handler, {
        message: storyMessages.DELETE.SUCCESS
      });
    } catch (err: any) {
      return this.replyError(err);
    }
  }

  //create task from story
  async createTaskUnderStory(requestHelper: RequestHelper, handler: any) {
    try {
      let payload = requestHelper.getPayload();
      const { storyId } = requestHelper.getAllParams();

      // If payload is a string (due to raw JSON body), parse it
      if (typeof payload === "string") {
        payload = JSON.parse(payload);
      }

      const taskData = {
        ...payload,
        story_id: storyId
      };

      console.log("Parsed Payload:", taskData); // should now look correct

      const newTask = await createTask(taskData);
      return this.sendResponse(handler, newTask);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // ✅ New: Get tasks by storyId
  async getTasksByStoryId(requestHelper: RequestHelper, handler: any) {
    try {
      const { storyId } = requestHelper.getAllParams();

      const tasks = await getTasksByStoryId(storyId);

      return this.sendResponse(handler, {
        message: taskMessages.FETCH.ALL_SUCCESS,
        data: tasks
      });
    } catch (err: any) {
      return this.replyError(err);
    }
  }
}

export default ProjectStoryController;
