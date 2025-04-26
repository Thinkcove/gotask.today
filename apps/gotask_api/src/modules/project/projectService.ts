import ProjectMessages from "../../constants/apiMessages/projectMessage";
import { IProject, Project } from "../../domain/model/project/project";
import { Organization } from "../../domain/model/organization/organization";
import {
  createNewProject,
  findAllProjects,
  findByProjectId,
  findByUserId,
  findProjectById,
  findProjectCountByStatus,
  findUsersByIds,
  saveProject,
  updateProjectById
} from "../../domain/interface/project/projectInterface";

// Create a new project
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
    // Fetch all projects
    const projects = await findAllProjects();

    // Gather all unique user IDs (filter out undefined values)
    const allUserIds = Array.from(
      new Set(
        projects.flatMap((project) => project.user_id?.filter((id) => id !== undefined) || [])
      )
    );

    // Fetch user details based on user IDs
    const users = await findUsersByIds(allUserIds);

    // Map user IDs to user objects for easy lookup
    const userMap = new Map(users.map((user) => [user.id, user]));

    // Attach user details to each project
    const enrichedProjects = projects.map((project) => ({
      ...project.toObject(),
      users: (project.user_id || [])
        .map((id: string) => userMap.get(id)) // Map to user details
        .filter(Boolean) // Filter out undefined or null values
    }));

    return {
      success: true,
      data: enrichedProjects
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectMessages.FETCH.FAILED_ALL
    };
  }
};

// Assign users to a project
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
      data: updatedProject,
      message: "Successfully Assigned to the project"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectMessages.ASSIGN.FAILED
    };
  }
};

// Get projects by user ID
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

// Assign project to an organization
const assignProjectToOrganization = async (
  project_id: string,
  organization_id: string
): Promise<IProject> => {
  try {
    const project = await Project.findOne({ id: project_id });
    const organization = await Organization.findOne({ id: organization_id });

    if (!project || !organization) {
      throw new Error("Invalid project_id or organization_id");
    }

    project.organization_id = organization.id;
    await project.save();
    return project;
  } catch (error: any) {
    throw new Error(error.message || "Failed to assign project to organization");
  }
};

// Get task count grouped by status
const getProjectCountByStatus = async (): Promise<{
  success: boolean;
  data?: Record<string, number>;
  message?: string;
}> => {
  try {
    const taskCounts = await findProjectCountByStatus();
    return {
      success: true,
      data: taskCounts
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "ProjectMessages.FETCH.FAILED_COUNTS"
    };
  }
};

// Get a task by ID
const getProjectById = async (
  id: string
): Promise<{ success: boolean; data?: IProject | null; message?: string }> => {
  try {
    const project = await findProjectById(id);
    if (!project) {
      return {
        success: false,
        message: ProjectMessages.FETCH.NOT_FOUND
      };
    }

    // Extract user IDs from the project
    const userIds = (project.user_id || []).filter((id) => id !== undefined);

    // Fetch user details
    const users = await findUsersByIds(userIds);

    // Map users for quick lookup
    const userMap = new Map(users.map((user) => [user.id, user]));

    // Enrich the project with user details
    const enrichedProject = {
      ...project.toObject(),
      users: userIds.map((id: string) => userMap.get(id)).filter(Boolean)
    };

    return {
      success: true,
      data: enrichedProject
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectMessages.FETCH.FAILED_BY_ID
    };
  }
};

// Remove users from a project
const removeUsersFromProject = async (
  userIds: string[],
  projectId: string
): Promise<{ success: boolean; data?: IProject; message?: string }> => {
  try {
    if (!Array.isArray(userIds) || userIds.length === 0 || !projectId) {
      return {
        success: false,
        message: ProjectMessages.REMOVE.INVALID_INPUT
      };
    }

    const project = await findByProjectId(projectId);
    if (!project) {
      return {
        success: false,
        message: ProjectMessages.REMOVE.PROJECT_NOT_FOUND
      };
    }

    if (!Array.isArray(project.user_id)) {
      project.user_id = [];
    }

    // Filter out the users to be removed
    project.user_id = project.user_id.filter((id: string) => !userIds.includes(id));

    await saveProject(project);

    return {
      success: true,
      message: "Successfully removed from the project"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectMessages.REMOVE.FAILED
    };
  }
};

// Update project
const updateProject = async (
  id: string,
  updateData: Partial<IProject>
): Promise<{ success: boolean; data?: IProject | null; message?: string }> => {
  try {
    const updatedProject = await updateProjectById(id, updateData);
    if (!updatedProject) {
      return {
        success: false,
        message: ProjectMessages.FETCH.NOT_FOUND
      };
    }
    return {
      success: true,
      data: updatedProject
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ProjectMessages.UPDATE.FAILED
    };
  }
};
export {
  createProject,
  getAllProjects,
  assignUsersToProject,
  getProjectsByUserId,
  assignProjectToOrganization,
  getProjectCountByStatus,
  getProjectById,
  removeUsersFromProject,
  updateProject
};
