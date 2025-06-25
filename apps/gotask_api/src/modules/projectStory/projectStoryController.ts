import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import {
  createStoryService,
  getStoriesByProjectService,
  getStoryByIdService,
  updateStoryService,
  deleteStoryService,
  getTasksByStoryId,
  getCommentsByStoryIdService,
  deleteCommentService,
  updateCommentService,
  createCommentService // ✅ Import added
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
      const { status, startDate, search } = requestHelper.getQuery();

      const stories = await getStoriesByProjectService({
        projectId,
        status,
        startDate,
        search
      });

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
  // Add comment
  async addComment(requestHelper: RequestHelper, handler: any) {
    try {
      const { comment } = requestHelper.getPayload();
      const { storyId } = requestHelper.getAllParams();
      const user = requestHelper.getUser();

      if (!comment) {
        return this.replyError(new Error(storyMessages.COMMENT.COMMENT_REQUIRED));
      }

      const newComment = await createCommentService({
        story_id: storyId,
        user_id: user?.id,
        user_name: user?.user_id || "Unknown",
        comment
      });

      return this.sendResponse(handler, {
        message: storyMessages.COMMENT.SUCCESS,
        data: newComment
      });
    } catch (err: any) {
      return this.replyError(err);
    }
  }

  // Update comment
  async updateComment(requestHelper: RequestHelper, handler: any) {
    try {
      const { commentId } = requestHelper.getAllParams();
      const { comment } = requestHelper.getPayload();

      if (!comment) {
        return this.replyError(new Error(storyMessages.COMMENT.COMMENT_REQUIRED));
      }

      const updated = await updateCommentService(commentId, { comment });

      if (!updated) {
        return this.replyError(new Error(storyMessages.COMMENT.NOT_FOUND));
      }

      return this.sendResponse(handler, {
        message: storyMessages.COMMENT.UPDATE_SUCCESS,
        data: updated
      });
    } catch (err: any) {
      return this.replyError(err, handler);
    }
  }

  // Delete comment
  async deleteComment(requestHelper: RequestHelper, handler: any) {
    try {
      const { commentId } = requestHelper.getAllParams();

      const deleted = await deleteCommentService(commentId);

      if (!deleted) {
        return this.replyError(new Error(storyMessages.COMMENT.NOT_FOUND));
      }

      return this.sendResponse(handler, {
        message: storyMessages.COMMENT.DELETE_SUCCESS,
        data: deleted
      });
    } catch (err: any) {
      return this.replyError(err, handler);
    }
  }

  // Get all comments
  async getCommentsByStoryId(requestHelper: RequestHelper, handler: any) {
    try {
      const { storyId } = requestHelper.getAllParams();

      const comments = await getCommentsByStoryIdService(storyId);

      return this.sendResponse(handler, {
        message: storyMessages.COMMENT.FETCH_SUCCESS,
        data: comments
      });
    } catch (err: any) {
      return this.replyError(err, handler);
    }
  }
}

export default ProjectStoryController;
