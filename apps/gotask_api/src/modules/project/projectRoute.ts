import { Request, ResponseToolkit } from "@hapi/hapi";
import ProjectController from "./projectController";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";

const projectController = new ProjectController();
const appName = APPLICATIONS.PROJECT;
const tags = [API, "Project"];
const ProjectRoutes = [];

// Route: Create Project
ProjectRoutes.push({
  path: API_PATHS.CREATE_PROJECT,
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    projectController.createProject(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Create a New Project",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get All Projects
ProjectRoutes.push({
  path: API_PATHS.GET_PROJECTS,
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    projectController.getAllProjects(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get All Projects",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Assign User to Project
ProjectRoutes.push({
  path: API_PATHS.ASSIGN_USER_TO_PROJECT,
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.ASSIGN, (request: Request, handler: ResponseToolkit) =>
    projectController.assignUserToProject(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Assign User to Project",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get Projects by User ID
ProjectRoutes.push({
  path: API_PATHS.GET_PROJECT_BY_USERID,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectController.getProjectsByUserId(new RequestHelper(request), handler),
  config: {
    notes: "Get Projects by User ID",
    tags
  }
});

// Route: Get Task Count by Status
ProjectRoutes.push({
  path: API_PATHS.GET_PROJECT_COUNT_BY_STATUS,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectController.getProjectCountByStatus(new RequestHelper(request), handler),
  config: {
    notes: "Get task count grouped by status",
    tags
  }
});

// Route: Get Project by ID
ProjectRoutes.push({
  path: API_PATHS.GET_PROJECT_BY_ID,
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.VIEW, (request: Request, handler: ResponseToolkit) =>
    projectController.getProjectById(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get a project by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Remove User from Project
ProjectRoutes.push({
  path: API_PATHS.REMOVE_USER_FROM_PROJECT,
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.UNASSIGN, (request: Request, handler: ResponseToolkit) =>
    projectController.removeUserFromProject(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Remove User from Project",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Update Project
ProjectRoutes.push({
  path: API_PATHS.UPDATE_PROJECT,
  method: API_METHODS.PUT,
  handler: permission(appName, ACTIONS.UPDATE, (request: Request, handler: ResponseToolkit) =>
    projectController.updateProjectDetails(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Update project details",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});
export default ProjectRoutes;
