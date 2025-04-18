import { IProject, Project } from "../../model/project/project";
import { User } from "../../model/user/user";

// Create a new project
const createNewProject = async (projectData: IProject): Promise<IProject> => {
  const newProject = new Project(projectData);
  return await newProject.save();
};

// Get all projects
const findAllProjects = async (): Promise<IProject[]> => {
  return await Project.find();
};

// Find a project by its ID
const findByProjectId = async (projectId: string): Promise<IProject | null> => {
  return await Project.findOne({ id: projectId });
};

// Get users by an array of user IDs
const findUsersByIds = async (userIds: string[]) => {
  return await User.find({ id: { $in: userIds } });
};

// Save project
const saveProject = async (project: IProject): Promise<IProject> => {
  return await project.save();
};

// Find projects by user ID
const findByUserId = async (userId: string): Promise<IProject[]> => {
  return await Project.find({ user_id: userId });
};

export {
  createNewProject,
  findAllProjects,
  findByProjectId,
  findUsersByIds,
  saveProject,
  findByUserId
};
