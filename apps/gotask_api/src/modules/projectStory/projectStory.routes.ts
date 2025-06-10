import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import ProjectStoryController from "./projectStory.controller";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import { permission } from "../../middleware/permission";
import authStrategy from "../../constants/auth/authStrategy";

const controller = new ProjectStoryController();
const appName = APPLICATIONS.PROJECT_STORY;
const tags = [API, "ProjectStory"];
const routes: ServerRoute[] = [];

// Create Story
routes.push({
  method: API_METHODS.POST,
  path: API_PATHS.CREATE_PROJECT_STORY,
  handler: permission(appName, ACTIONS.CREATE, (req: Request, h: ResponseToolkit) =>
    controller.createStory(new RequestHelper(req), h)
  ),
  options: {
    notes: "Create a story under a project",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Get All Stories by Project
routes.push({
  method: API_METHODS.GET,
  path: API_PATHS.GET_STORIES_BY_PROJECT,
  handler: permission(appName, ACTIONS.VIEW, (req: Request, h: ResponseToolkit) =>
    controller.getStoriesByProject(new RequestHelper(req), h)
  ),
  options: {
    notes: "Get stories under a project",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Get Story by ID
routes.push({
  method: API_METHODS.GET,
  path: API_PATHS.GET_PROJECT_STORY_BY_ID,
  handler: permission(appName, ACTIONS.VIEW, (req: Request, h: ResponseToolkit) =>
    controller.getStoryById(new RequestHelper(req), h)
  ),
  options: {
    notes: "Get story by ID",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

export default routes;
