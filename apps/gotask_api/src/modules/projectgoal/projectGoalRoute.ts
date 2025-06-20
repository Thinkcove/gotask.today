import { Request, ResponseToolkit } from "@hapi/hapi";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";
import ProjectGoalController from "../projectgoal/projectGoalController";

const projectGoalController = new ProjectGoalController();
const appName = APPLICATIONS.Project_GOAL;
const tags = [API, "WeeklyGoal"];
const ProjectGoalRoutes = [];

// Route: Create ProjectGoal
ProjectGoalRoutes.push({
  path: "/project/goals",
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectGoalController.createProjectGoal(new RequestHelper(request), handler),
  config: {
    notes: "Create a ProjectGoal",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Get All ProjectGoals
ProjectGoalRoutes.push({
  path: "/project/goals",
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectGoalController.getAllProjectGoals(new RequestHelper(request), handler),
  config: {
    notes: "Get All ProjectGoals",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Get ProjectGoal by ID
ProjectGoalRoutes.push({
  path: "/project/goals/{id}",
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectGoalController.getProjectGoalById(new RequestHelper(request), handler),
  config: {
    notes: "Get ProjectGoal by ID",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Update ProjectGoal
ProjectGoalRoutes.push({
  path: "/project/goals/{id}",
  method: API_METHODS.PUT,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectGoalController.updateProjectGoal(new RequestHelper(request), handler),
  config: {
    notes: "Update ProjectGoal",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Delete ProjectGoal
ProjectGoalRoutes.push({
  path: "/project/goals/{id}",
  method: API_METHODS.DELETE,
  handler: permission(appName, ACTIONS.DELETE, (request: Request, handler: ResponseToolkit) =>
    projectGoalController.deleteProjectGoal(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Delete ProjectGoal",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Get ProjectGoals by User ID
ProjectGoalRoutes.push({
  path: "/project/goals/user/{user_id}",
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectGoalController.findProjectGoalsByUserId(new RequestHelper(request), handler),
  config: {
    notes: "Get ProjectGoals by User ID",
    tags
  }
});

// Route: Get ProjectGoals by Project ID
ProjectGoalRoutes.push({
  path: "/project/goals/project/{project_id}",
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectGoalController.getProjectGoalById(new RequestHelper(request), handler),
  config: {
    notes: "Get ProjectGoals by Project ID",
    tags
  }
});

ProjectGoalRoutes.push({
  path: "/project/goals/comments",
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectGoalController.createComment(new RequestHelper(request), handler),
  config: {
    notes: "Add a comment to a project goal",
    tags: ["api", "projectGoal"],
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});
export default ProjectGoalRoutes;
