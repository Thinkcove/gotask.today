// projectStory.controller.ts
import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import {
  createStoryService,
  getStoriesByProjectService,
  getStoryByIdService,
  addCommentToStoryService
} from "./projectStory.service";
import { storyMessages } from "../../constants/apiMessages/projectStoryMessages";
import { AuthCredentials } from "../../constants/auth/auth";

class ProjectStoryController extends BaseController {
  async createStory(requestHelper: RequestHelper, handler: any) {
    try {
      const { title, description } = requestHelper.getPayload() || {};
      const { projectId } = requestHelper.getAllParams();
      const { userId } = requestHelper.getRequest().auth.credentials as unknown as AuthCredentials;

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
      const { userId } = requestHelper.getRequest().auth.credentials as unknown as AuthCredentials;

      if (!comment) {
        return this.replyError(new Error(storyMessages.COMMENT.COMMENT_REQUIRED));
      }

      const updatedStory = await addCommentToStoryService(storyId, {
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
}

export default ProjectStoryController;
