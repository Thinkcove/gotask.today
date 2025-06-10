// src/modules/projectStory/projectStory.routes.ts

import { ServerRoute } from "@hapi/hapi";
import {
  createStoryHandler,
  getStoriesByProjectHandler,
  getStoryByIdHandler,
} from "./projectStory.controller";

export const projectStoryRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/api/projects/{projectId}/stories",
    handler: createStoryHandler,
    options: {
      auth: "jwt", // assumes JWT middleware is used
      tags: ["api", "Project Story"],
      description: "Create a new project story",
    },
  },
  {
    method: "GET",
    path: "/api/projects/{projectId}/stories",
    handler: getStoriesByProjectHandler,
    options: {
      auth: "jwt",
      tags: ["api", "Project Story"],
      description: "Get all stories for a project",
    },
  },
  {
    method: "GET",
    path: "/api/stories/{storyId}",
    handler: getStoryByIdHandler,
    options: {
      auth: "jwt",
      tags: ["api", "Project Story"],
      description: "Get details of a specific story",
    },
  },
];
