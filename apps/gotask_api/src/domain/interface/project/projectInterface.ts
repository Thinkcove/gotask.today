import { PROJECT_STATUS } from "../../../constants/projectConstant";
import { IProject, Project } from "../../model/project/project";
import { User } from "../../model/user/user";

// Create a new project
const createNewProject = async (projectData: IProject): Promise<IProject> => {
  const newProject = new Project(projectData);
  return await newProject.save();
};

// Get all projects
const findAllProjects = async (): Promise<IProject[]> => {
  return await Project.find().sort({ updatedAt: -1 });
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

// Get project count grouped by status
const findProjectCountByStatus = async (): Promise<Record<string, number>> => {
  const projectCounts = await Project.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const defaultStatuses: Record<string, number> = Object.values(PROJECT_STATUS).reduce(
    (acc: Record<string, number>, status: string) => {
      acc[status] = 0;
      return acc;
    },
    {}
  );

  return projectCounts.reduce((acc: Record<string, number>, item) => {
    acc[item._id] = item.count;
    return acc;
  }, defaultStatuses);
};

// Find a project by ID
const findProjectById = async (id: string): Promise<IProject | null> => {
  return await Project.findOne({ id });
};


const updateProjectById = async (
  id: string,
  updateData: Partial<IProject>
): Promise<IProject | null> => {
  return await Project.findOneAndUpdate({ id }, updateData, { new: true });
};

const findProjectsWithFilters = async (filters: {
  status?: string[];
  organization_id?: string;
  name?: string;
  user_id?: string[];  // array of user ids
}) => {
  const query: any = {};

  if (filters.status && filters.status.length > 0) {
    query.status = { $in: filters.status };
  }

  if (filters.organization_id) {
    query.organization_id = filters.organization_id;
  }

  if (filters.name) {
    query.name = { $regex: filters.name, $options: "i" };
  }

  if (filters.user_id && filters.user_id.length > 0) {
    query.user_id = { $in: filters.user_id };
  }

  return Project.find(query);
};



export {
  createNewProject,
  findAllProjects,
  findByProjectId,
  findUsersByIds,
  saveProject,
  findByUserId,
  findProjectCountByStatus,
  findProjectById,
  updateProjectById,
  findProjectsWithFilters
};
