import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import {
  assignUsersToProject,
  createProject,
  getAllProjects,
  getProjectById,
  getProjectCountByStatus,
  getProjectsByUserId
} from "./projectService";

class ProjectController extends BaseController {
  // Create a new project
  async createProject(requestHelper: RequestHelper, handler: any) {
    try {
      const projectData = requestHelper.getPayload();
      if (!projectData) {
        throw new Error("Missing required fields");
      }
      const newProject = await createProject(projectData);
      return this.sendResponse(handler, newProject);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get all projects
  async getAllProjects(_requestHelper: RequestHelper, handler: any) {
    try {
      const projects = await getAllProjects();
      return this.sendResponse(handler, projects);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Assign users to a project
  async assignUserToProject(requestHelper: RequestHelper, handler: any) {
    try {
      const { user_id, project_id } = requestHelper.getPayload();
      if (!user_id || !Array.isArray(user_id) || !project_id) {
        throw new Error(
          "Invalid payload. 'user_id' must be an array and 'project_id' is required."
        );
      }
      const result = await assignUsersToProject(user_id, project_id);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get projects by user ID
  async getProjectsByUserId(requestHelper: RequestHelper, handler: any) {
    try {
      const user_id = requestHelper.getParam("user_id");
      if (!user_id) {
        throw new Error("User ID is required");
      }
      const projects = await getProjectsByUserId(user_id);
      return this.sendResponse(handler, projects);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get Task Count by Status
  async getProjectCountByStatus(_requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getProjectCountByStatus();
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  // Get Project by ID
  async getProjectById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const project = await getProjectById(id);
      return this.sendResponse(handler, project);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }
}

export default ProjectController;
