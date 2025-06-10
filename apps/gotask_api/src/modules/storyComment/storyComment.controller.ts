// src/modules/storyComment/storyComment.controller.ts

import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import {
  addCommentService,
  getCommentsByStoryService
} from "./storyComment.service";
import { storyCommentMessages } from "../../constants/apiMessages/storyCommentMessages";
import { AuthCredentials } from "../../constants/auth/auth";

class StoryCommentController extends BaseController {
  async addComment(requestHelper: RequestHelper, handler: any) {
    try {
      const { comment } = requestHelper.getPayload() || {};
      const { storyId } = requestHelper.getAllParams();
      const { userId } = requestHelper.getRequest().auth.credentials as unknown as AuthCredentials;

      if (!comment) {
        return this.replyError(new Error(storyCommentMessages.CREATE.COMMENT_REQUIRED));
      }

      const newComment = await addCommentService({
        storyId,
        userId,
        comment
      });

      return this.sendResponse(handler, {
        message: storyCommentMessages.CREATE.SUCCESS,
        data: newComment
      });
    } catch (err: any) {
      return this.replyError(err);
    }
  }

  async getCommentsByStory(requestHelper: RequestHelper, handler: any) {
    try {
      const { storyId } = requestHelper.getAllParams();
      const comments = await getCommentsByStoryService(storyId);

      return this.sendResponse(handler, {
        message: storyCommentMessages.FETCH.SUCCESS,
        data: comments
      });
    } catch (err: any) {
      return this.replyError(err);
    }
  }
}

export default StoryCommentController;
