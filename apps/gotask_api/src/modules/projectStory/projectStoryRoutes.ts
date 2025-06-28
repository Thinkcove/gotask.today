import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import ProjectStoryController from "./projectStoryController";
import authStrategy from "../../constants/auth/authStrategy";

const controller = new ProjectStoryController();
const tags = [API, "ProjectStory"];
const routes: ServerRoute[] = [];

// Create a new story
routes.push({
  method: API_METHODS.POST,
  path: "/createStory/{projectId}",
  handler: (req: Request, h: ResponseToolkit) => controller.createStory(new RequestHelper(req), h),
  options: {
    notes: "Create a story under a project",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Get all stories for a project
routes.push({
  method: API_METHODS.GET,
  path: "/getStories/{projectId}",
  handler: (req: Request, h: ResponseToolkit) =>
    controller.getStoriesByProject(new RequestHelper(req), h),
  options: {
    notes: "Get stories under a project",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Get a single story by ID
routes.push({
  method: API_METHODS.GET,
  path: "/story/{storyId}",
  handler: (req: Request, h: ResponseToolkit) => controller.getStoryById(new RequestHelper(req), h),
  options: {
    notes: "Get story by ID",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Update a story
routes.push({
  method: API_METHODS.PUT,
  path: "/story/update/{storyId}",
  handler: (req: Request, h: ResponseToolkit) => controller.updateStory(new RequestHelper(req), h),
  options: {
    notes: "Update a story by ID",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Delete a story
routes.push({
  method: API_METHODS.DELETE,
  path: "/story/delete/{storyId}",
  handler: (req: Request, h: ResponseToolkit) => controller.deleteStory(new RequestHelper(req), h),
  options: {
    notes: "Delete a story by ID",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Get all tasks by storyId
routes.push({
  method: API_METHODS.GET,
  path: "/story/{storyId}/tasks",
  handler: (req: Request, h: ResponseToolkit) =>
    controller.getTasksByStoryId(new RequestHelper(req), h),
  options: {
    notes: "Get all tasks linked to a specific story",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Add comment to a story
routes.push({
  method: API_METHODS.POST,
  path: "/story/comment/{storyId}",
  handler: (req: Request, h: ResponseToolkit) => controller.addComment(new RequestHelper(req), h),
  options: {
    notes: "Add comment to a story",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

//  Update a story comment by comment ID
routes.push({
  method: API_METHODS.PUT,
  path: "/story/comment/{commentId}",
  handler: (req: Request, h: ResponseToolkit) =>
    controller.updateComment(new RequestHelper(req), h),
  options: {
    notes: "Update comment on a story",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Delete a story comment by comment ID
routes.push({
  method: API_METHODS.DELETE,
  path: "/story/comment/{commentId}",
  handler: (req: Request, h: ResponseToolkit) =>
    controller.deleteComment(new RequestHelper(req), h),
  options: {
    notes: "Delete comment from a story",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

//  Get all comments for a story (useful if frontend shows comments separately)
routes.push({
  method: API_METHODS.GET,
  path: "/story/{storyId}/comments",
  handler: (req: Request, h: ResponseToolkit) =>
    controller.getCommentsByStoryId(new RequestHelper(req), h),
  options: {
    notes: "Get all comments for a story",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

export default routes;
