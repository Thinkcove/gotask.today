import { IProject, Project } from "../../domain/model/project";
import { User } from "../../domain/model/user";
import { Organization } from "../../domain/model/organization";

export class ProjectService {
  // Create a new project
  static async createProject(projectData: IProject): Promise<IProject> {
    const newProject = new Project(projectData);
    return await newProject.save();
  }

  // Get all projects
  static async getAllProjects(): Promise<IProject[]> {
    return await Project.find(); // Fetches all projects
  }

  // Assign User to Project
  static async assignUsersToProject(user_id: string[], project_id: string): Promise<IProject> {
    const users = await User.find({ id: { $in: user_id } });
    const project = await Project.findOne({ id: project_id });
    if (!users.length || !project) {
      throw new Error("Invalid user_ids or project_id");
    }
    // Ensure `user_ids` is an array before pushing new users
    if (!Array.isArray(project.user_id)) {
      project.user_id = [];
    }
    // Add only unique users
    const uniqueUsers = [...new Set([...project.user_id, ...users.map((u) => u.id)])];
    project.user_id = uniqueUsers;
    await project.save();
    return project;
  }

  static async assignProjectToOrganization(project_id: string, organization_id: string): Promise<IProject> {
    const project = await Project.findOne({ id: project_id });
    const organization = await Organization.findOne({ id: organization_id });
  
    if (!project || !organization) {
      throw new Error("Invalid project_id or organization_id");
    }
  
    project.organization_id = organization.id;
    await project.save();
    return project;
  }

  // Get Projects by User ID
  static async getProjectsByUserId(user_id: string): Promise<IProject[]> {
    return await Project.find({ user_id });
  }
}
