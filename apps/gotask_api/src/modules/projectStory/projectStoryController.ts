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

class ProjectStoryController extends BaseController {
  async createStory(requestHelper: RequestHelper, handler: any) {
    try {
      const { title, description, status } = requestHelper.getPayload() || {};
      const { projectId } = requestHelper.getAllParams();
      const user = requestHelper.getUser();
      const userId = user?.id;

      if (!title) {
        return this.replyError(new Error(storyMessages.CREATE.TITLE_REQUIRED));
      }

      const story = await createStoryService({
        title,
        description,
        status,
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
      const { title, description, status } = requestHelper.getPayload();


      if (!title && !description && !status) {
        return this.replyError(new Error(storyMessages.UPDATE.NO_FIELDS));
      }

      const updatedStory = await updateStoryService(storyId, {
        title,
        description,
        status
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

  async getTasksByStoryId(requestHelper: RequestHelper, handler: any) {
    try {
      const { storyId } = requestHelper.getAllParams();
      if (!storyId) {
        return this.replyError(new Error(storyMessages.TASK.FETCH_FAILED));
      }

      const tasks = await getTasksByStoryId(storyId);

      return this.sendResponse(handler, {
        message: storyMessages.TASK.FETCH_SUCCESS,
        data: tasks
      });
    } catch (err: any) {
      return this.replyError(err, handler);
    }
  }
}

export default ProjectStoryController;
