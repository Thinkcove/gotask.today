// src/service/weeklyGoal/weeklyGoalService.ts
import { v4 as uuidv4 } from "uuid";
import { IWeeklyGoal, WeeklyGoal } from "../../model/trackwekly/trackwekly";

// Create a new weekly goal
const createWeeklyGoalNew = async (goalData: Omit<IWeeklyGoal, "id">): Promise<IWeeklyGoal> => {
  const newGoal = new WeeklyGoal({ ...goalData, id: uuidv4() });
  return await newGoal.save();
};

// Get all goals
const getAllWeeklyGoalsNew = async (): Promise<IWeeklyGoal[]> => {
  return await WeeklyGoal.find().sort({ updatedAt: -1 }).exec();
};

// Get goal by ID
const getWeeklyGoalByIdNew = async (id: string): Promise<IWeeklyGoal | null> => {
  return await WeeklyGoal.findOne({ id }); // ✅ use `id`, not `_id`
};

// Update goal by ID
const updateWeeklyGoalNew = async (
  id: string,
  updateData: Partial<IWeeklyGoal>
): Promise<IWeeklyGoal | null> => {
  return await WeeklyGoal.findOneAndUpdate({ id }, updateData, { new: true }).exec();
};

// Delete goal by ID
const deleteWeeklyGoalNew = async (id: string): Promise<IWeeklyGoal | null> => {
  return await WeeklyGoal.findOneAndDelete({ id }).exec();
};

// Find goals by user
const findGoalsByUserIdNew = async (userId: string): Promise<IWeeklyGoal[]> => {
  return await WeeklyGoal.find({ userId }).sort({ updatedAt: -1 }).exec();
};

// Find goals by project
const findGoalsByProjectIdNew = async (projectId: string): Promise<IWeeklyGoal[]> => {
  return await WeeklyGoal.find({ projectId }).sort({ updatedAt: -1 }).exec();
};

export {
  createWeeklyGoalNew,
  getAllWeeklyGoalsNew,
  getWeeklyGoalByIdNew,
  updateWeeklyGoalNew,
  deleteWeeklyGoalNew,
  findGoalsByUserIdNew,
  findGoalsByProjectIdNew
};
