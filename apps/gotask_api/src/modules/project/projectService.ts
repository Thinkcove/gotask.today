import { IProject } from "../../domain/interface/project";
import { Project } from "../../domain/model/project";

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
}
