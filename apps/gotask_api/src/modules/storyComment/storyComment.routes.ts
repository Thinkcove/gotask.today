// src/modules/storyComment/storyComment.routes.ts

import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import StoryCommentController from "./storyComment.controller";
import { APPLICATIONS, ACTIONS } from "../../constants/accessCheck/authorization";
import { permission } from "../../middleware/permission";
import authStrategy from "../../constants/auth/authStrategy";

const storyCommentController = new StoryCommentController();
const appName = APPLICATIONS.STORY_COMMENT;
const tags = [API, "StoryComment"];

export const storyCommentRoutes = [
  {
    method: API_METHODS.POST,
    path: API_PATHS.ADD_COMMENT, // "/stories/{storyId}/comments"
    handler: permission(appName, ACTIONS.CREATE, (request: Request, h: ResponseToolkit) =>
      storyCommentController.addComment(new RequestHelper(request), h)
    ),
    options: {
      auth: {
        strategy: authStrategy.SIMPLE,
      },
      tags,
      description: "Add a comment to a story",
    },
  },
  {
    method: API_METHODS.GET,
    path: API_PATHS.GET_COMMENTS_BY_STORY, // "/stories/{storyId}/comments"
    handler: permission(appName, ACTIONS.VIEW, (request: Request, h: ResponseToolkit) =>
      storyCommentController.getCommentsByStory(new RequestHelper(request), h)
    ),
    options: {
      auth: {
        strategy: authStrategy.SIMPLE,
      },
      tags,
      description: "Get all comments for a story",
    },
  },
];
