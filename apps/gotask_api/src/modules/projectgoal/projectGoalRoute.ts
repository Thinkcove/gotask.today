import { Request, ResponseToolkit } from "@hapi/hapi";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";
import ProjectGoalController from "./projectGoalController";

const projectGoalController = new ProjectGoalController();
const appName = APPLICATIONS.Project_GOAL;
const tags = [API, "WeeklyGoal"];
const ProjectGoalRoutes = [];

// Route: Create Weekly Goal
ProjectGoalRoutes.push({
  path: "/project/goals",
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectGoalController.createProjectGoal(new RequestHelper(request), handler),
  config: {
    notes: "Create a Weekly Goal",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Get All Weekly Goals
ProjectGoalRoutes.push({
  path: "/project/goals",
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectGoalController.getAllProjectGoals(new RequestHelper(request), handler),
  config: {
    notes: "Get All Weekly Goals",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Get Weekly Goal by ID
ProjectGoalRoutes.push({
  path: "/project/goals/{id}",
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectGoalController.getProjectGoalById(new RequestHelper(request), handler),
  config: {
    notes: "Get Weekly Goal by ID",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Update Weekly Goal
ProjectGoalRoutes.push({
  path: "/project/goals/{id}",
  method: API_METHODS.PUT,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectGoalController.updateProjectGoal(new RequestHelper(request), handler),
  config: {
    notes: "Update Weekly Goal",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Delete Weekly Goal
ProjectGoalRoutes.push({
  path: "/project/goals/{id}",
  method: API_METHODS.DELETE,
  handler: permission(appName, ACTIONS.DELETE, (request: Request, handler: ResponseToolkit) =>
    projectGoalController.deleteProjectGoal(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Delete Weekly Goal",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Get Weekly Goals by User ID
ProjectGoalRoutes.push({
  path: "/project/goals/user/{user_id}",
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectGoalController.findProjectGoalsByUserId(new RequestHelper(request), handler),
  config: {
    notes: "Get Weekly Goals by User ID",
    tags
  }
});

// Route: Get Weekly Goals by Project ID
ProjectGoalRoutes.push({
  path: "/project/goals/project/{project_id}",
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectGoalController.getProjectGoalById(new RequestHelper(request), handler),
  config: {
    notes: "Get Weekly Goals by Project ID",
    tags
  }
});

export default ProjectGoalRoutes;
