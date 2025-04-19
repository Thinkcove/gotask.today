import { Request, ResponseToolkit } from "@hapi/hapi";
import ProjectController from "./projectController";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";

const projectController = new ProjectController();

const tags = [API, "Project"];
const ProjectRoutes = [];

// Route: Create Project
ProjectRoutes.push({
  path: API_PATHS.CREATE_PROJECT,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectController.createProject(new RequestHelper(request), handler),
  config: {
    notes: "Create a New Project",
    tags
  }
});

// Route: Get All Projects
ProjectRoutes.push({
  path: API_PATHS.GET_PROJECTS,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectController.getAllProjects(new RequestHelper(request), handler),
  config: {
    notes: "Get All Projects",
    tags
  }
});

// Route: Assign User to Project
ProjectRoutes.push({
  path: API_PATHS.ASSIGN_USER_TO_PROJECT,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    projectController.assignUserToProject(new RequestHelper(request), handler),
  config: {
    notes: "Assign User to Project",
    tags
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

export default ProjectRoutes;
