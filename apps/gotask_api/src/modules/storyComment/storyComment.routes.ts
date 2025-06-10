// src/modules/storyComment/storyComment.routes.ts

import { ServerRoute } from "@hapi/hapi";
import {
  addCommentHandler,
  getCommentsByStoryHandler,
} from "./storyComment.controller";

export const storyCommentRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/api/stories/{storyId}/comments",
    handler: addCommentHandler,
    options: {
      auth: "jwt",
      tags: ["api", "Story Comment"],
      description: "Add a comment to a story",
    },
  },
  {
    method: "GET",
    path: "/api/stories/{storyId}/comments",
    handler: getCommentsByStoryHandler,
    options: {
      auth: "jwt",
      tags: ["api", "Story Comment"],
      description: "Get all comments for a story",
    },
  },
];
