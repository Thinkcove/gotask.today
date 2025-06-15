// projectStory.routes.ts
import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import ProjectStoryController from "./projectStoryController";
import authStrategy from "../../constants/auth/authStrategy";

const controller = new ProjectStoryController();
const tags = [API, "ProjectStory"];
const routes: ServerRoute[] = [];

routes.push({
  method: API_METHODS.POST,
  path: "/project/{projectId}/story",
  handler: (req: Request, h: ResponseToolkit) =>
    controller.createStory(new RequestHelper(req), h),
  options: {
    notes: "Create a story under a project",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

routes.push({
  method: API_METHODS.GET,
  path: "/projects/{projectId}/stories",
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
  path: "/stories/{storyId}",
  handler: (req: Request, h: ResponseToolkit) =>
    controller.getStoryById(new RequestHelper(req), h),
  options: {
    notes: "Get story by ID",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

routes.push({
  method: API_METHODS.POST,
  path: "/story/{storyId}/comment",
  handler: (req: Request, h: ResponseToolkit) =>
    controller.addComment(new RequestHelper(req), h),
  options: {
    notes: "Add comment to a story",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

export default routes;
