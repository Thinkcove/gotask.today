// src/service/ProjectGoal/ProjectGoalService.ts
import { v4 as uuidv4 } from "uuid";
import { IProjectGoal, ProjectGoal } from "../../model/projectGoal/projectGoal";

// Create a new Project goal
const createProjectGoalNew = async (goalData: Omit<IProjectGoal, "id">): Promise<IProjectGoal> => {
  const newGoal = new ProjectGoal({ ...goalData, id: uuidv4() });
  return await newGoal.save();
};

// Get all goals
const getAllProjectGoalsNew = async (): Promise<IProjectGoal[]> => {
  return await ProjectGoal.find().sort({ updatedAt: -1 }).exec();
};

// Get goal by ID
const getProjectGoalByIdNew = async (id: string): Promise<IProjectGoal | null> => {
  return await ProjectGoal.findOne({ id });
};

// Update goal by ID
const updateProjectGoalNew = async (
  id: string,
  updateData: Partial<IProjectGoal>
): Promise<IProjectGoal | null> => {
  return await ProjectGoal.findOneAndUpdate({ id }, updateData, { new: true }).exec();
};

// Delete goal by ID
const deleteProjectGoalNew = async (id: string): Promise<IProjectGoal | null> => {
  return await ProjectGoal.findOneAndDelete({ id }).exec();
};

// Find goals by user
const findGoalsByUserIdNew = async (userId: string): Promise<IProjectGoal[]> => {
  return await ProjectGoal.find({ userId }).sort({ updatedAt: -1 }).exec();
};

// Find goals by project
const findGoalsByProjectIdNew = async (projectId: string): Promise<IProjectGoal[]> => {
  return await ProjectGoal.find({ projectId }).sort({ updatedAt: -1 }).exec();
};

export {
  createProjectGoalNew,
  getAllProjectGoalsNew,
  getProjectGoalByIdNew,
  updateProjectGoalNew,
  deleteProjectGoalNew,
  findGoalsByUserIdNew,
  findGoalsByProjectIdNew
};
