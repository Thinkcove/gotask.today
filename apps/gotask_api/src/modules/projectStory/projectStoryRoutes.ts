import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import ProjectStoryController from "./projectStoryController";
import authStrategy from "../../constants/auth/authStrategy";

const controller = new ProjectStoryController();
const tags = [API, "ProjectStory"];
const routes: ServerRoute[] = [];

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

//  Update a story
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

//  Delete a story
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

export default routes;
