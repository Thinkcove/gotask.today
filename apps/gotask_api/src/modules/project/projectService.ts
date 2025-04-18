import ProjectMessages from "../../constants/apiMessages/projectMessage";
import {
  createNewProject,
  findAllProjects,
  findByProjectId,
  findByUserId,
  findUsersByIds,
  saveProject
} from "../../domain/interface/project/projectInterface";
import { IProject } from "../../domain/model/project/project";

//Create a new project
const createProject = async (
  projectData: IProject
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    if (!projectData) {
      return {
        success: false,
        message: ProjectMessages.CREATE.REQUIRED
      };
    }

    const createProject = await createNewProject(projectData);
    return {
      success: true,
      data: createProject
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectMessages.CREATE.FAILED
    };
  }
};

const getAllProjects = async (): Promise<{
  success: boolean;
  data?: IProject[];
  message?: string;
}> => {
  try {
    const projects = await findAllProjects();
    return {
      success: true,
      data: projects
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectMessages.FETCH.FAILED_ALL
    };
  }
};

const assignUsersToProject = async (
  userIds: string[],
  projectId: string
): Promise<{ success: boolean; data?: IProject; message?: string }> => {
  try {
    if (!Array.isArray(userIds) || userIds.length === 0 || !projectId) {
      return {
        success: false,
        message: ProjectMessages.ASSIGN.INVALID_INPUT
      };
    }
    const users = await findUsersByIds(userIds);
    if (!users.length) {
      return {
        success: false,
        message: ProjectMessages.ASSIGN.NO_USERS_FOUND
      };
    }
    const project = await findByProjectId(projectId);
    if (!project) {
      return {
        success: false,
        message: ProjectMessages.ASSIGN.PROJECT_NOT_FOUND
      };
    }
    project.user_id = Array.isArray(project.user_id) ? project.user_id : [];
    const existingUserIds = new Set(project.user_id);
    users.forEach((user: any) => existingUserIds.add(user.id));
    project.user_id = Array.from(existingUserIds);
    const updatedProject = await saveProject(project);
    return {
      success: true,
      data: updatedProject
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectMessages.ASSIGN.FAILED
    };
  }
};

const getProjectsByUserId = async (
  userId: string
): Promise<{ success: boolean; data?: IProject[]; message?: string }> => {
  try {
    if (!userId) {
      return {
        success: false,
        message: ProjectMessages.USER.REQUIRED
      };
    }
    const projects = await findByUserId(userId);
    return {
      success: true,
      data: projects
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectMessages.FETCH.FAILED_BY_USER
    };
  }
};

export { createProject, getAllProjects, assignUsersToProject, getProjectsByUserId };
