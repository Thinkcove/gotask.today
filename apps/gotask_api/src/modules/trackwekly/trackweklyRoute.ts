import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";
import WeeklyGoalController from "./trackweklyController";

const weeklyGoalController = new WeeklyGoalController();
const appName = APPLICATIONS.WEEKLY_GOAL; // Make sure this key exists
const tags = [API, "WeeklyGoal"];
const WeeklyGoalRoutes = [];

// Route: Create Weekly Goal
WeeklyGoalRoutes.push({
  path: API_PATHS.CREATE_WEEKLY_GOAL,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    weeklyGoalController.createWeeklyGoal(new RequestHelper(request), handler),
  config: {
    notes: "Create a Weekly Goal",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Get All Weekly Goals
WeeklyGoalRoutes.push({
  path: API_PATHS.GET_ALL_WEEKLY_GOALS,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    weeklyGoalController.getAllWeeklyGoals(new RequestHelper(request), handler),
  config: {
    notes: "Get All Weekly Goals",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Get Weekly Goal by ID
WeeklyGoalRoutes.push({
  path: API_PATHS.GET_WEEKLY_GOAL_BY_ID,
  method: API_METHODS.GET,
  handler:  (request: Request, handler: ResponseToolkit) =>
    weeklyGoalController.getWeeklyGoalById(new RequestHelper(request), handler)
  ,
  config: {
    notes: "Get Weekly Goal by ID",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Update Weekly Goal
WeeklyGoalRoutes.push({
  path: API_PATHS.UPDATE_WEEKLY_GOAL,
  method: API_METHODS.PUT,
  handler:  (request: Request, handler: ResponseToolkit) =>
    weeklyGoalController.updateWeeklyGoal(new RequestHelper(request), handler)
  ,
  config: {
    notes: "Update Weekly Goal",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Delete Weekly Goal
WeeklyGoalRoutes.push({
  path: API_PATHS.DELETE_WEEKLY_GOAL,
  method: API_METHODS.DELETE,
  handler: permission(appName, ACTIONS.DELETE, (request: Request, handler: ResponseToolkit) =>
    weeklyGoalController.deleteWeeklyGoal(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Delete Weekly Goal",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Get Weekly Goals by User ID
WeeklyGoalRoutes.push({
  path: API_PATHS.GET_WEEKLY_GOALS_BY_USER,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    weeklyGoalController.findWeeklyGoalsByUserId(new RequestHelper(request), handler),
  config: {
    notes: "Get Weekly Goals by User ID",
    tags
  }
});

// Route: Get Weekly Goals by Project ID
WeeklyGoalRoutes.push({
  path: API_PATHS.GET_WEEKLY_GOALS_BY_PROJECT,
  method: API_METHODS.GET,
  // Original (with permission)
  handler: (request: Request, handler: ResponseToolkit) =>
    weeklyGoalController.getAllWeeklyGoals(new RequestHelper(request), handler),
  config: {
    notes: "Get Weekly Goals by Project ID",
    tags
  }
});

export default WeeklyGoalRoutes;
