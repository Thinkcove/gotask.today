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
