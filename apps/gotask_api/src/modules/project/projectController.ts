import { Request, ResponseToolkit } from "@hapi/hapi";
import RequestHelper from "../../helpers/requestHelper";
import { errorResponse, successResponse } from "../../helpers/responseHelper";
import { ProjectService } from "./projectService";

// Create a Project
export const createProject = async (request: Request, h: ResponseToolkit) => {
  try {
    const requestHelper = new RequestHelper(request);
    const projectData = requestHelper.getPayload();
    if (!projectData) {
      return errorResponse(h, "Missing required fields", 400);
    }
    const newProject = await ProjectService.createProject(projectData);
    return successResponse(h, newProject, 200);
  } catch (error) {
    return errorResponse(h, "Failed to create project");
  }
};

// Get All Projects
export const getAllProjects = async (_request: Request, h: ResponseToolkit) => {
  try {
    const projects = await ProjectService.getAllProjects();
    return successResponse(h, projects);
  } catch (error) {
    return errorResponse(h, "Failed to retrieve projects");
  }
};

// Assign User to Project
export const assignUserToProject = async (request: Request, h: ResponseToolkit) => {
  try {
    const requestHelper = new RequestHelper(request);
    const { user_id, project_id } = requestHelper.getPayload(); // Accept multiple users
    if (!user_id || !Array.isArray(user_id) || !project_id) {
      return errorResponse(h, "Invalid payload. 'user_ids' must be an array.", 400);
    }
    const result = await ProjectService.assignUsersToProject(user_id, project_id);
    return successResponse(h, result, 200);
  } catch (error: any) {
    return errorResponse(h, error.message, 500);
  }
};

// Get Projects by User ID
export const getProjectsByUserId = async (request: Request, h: ResponseToolkit) => {
  try {
    const user_id = request.params.user_id;
    if (!user_id) {
      return errorResponse(h, "User ID is required", 400);
    }
    const projects = await ProjectService.getProjectsByUserId(user_id);
    return successResponse(h, projects, 200);
  } catch (error) {
    return errorResponse(h, "Failed to retrieve projects for user", 500);
  }
};
