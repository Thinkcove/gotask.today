import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { TASK_STATUS } from "../../../constants/taskConstant";
import { generateHistoryEntry } from "../../../constants/utils/taskHistory";
import { Project } from "../../model/project/project";
import { ITask, Task } from "../../model/task/task";
import { ITaskComment, TaskComment } from "../../model/task/taskComment";
import { User } from "../../model/user/user";
import { ITaskHistory, TaskHistorySchema } from "../../model/task/taskHistory";
import logger from "../../../common/logger";
import { TimeUtil } from "../../../constants/utils/timeUtils";
import { ITimeSpentEntry } from "../../model/task/timespent";
import { TIME_FORMAT_PATTERNS } from "../../../constants/commonConstants/timeConstants";

// Create a new task
const createNewTask = async (taskData: Partial<ITask>): Promise<ITask> => {
  const user = await User.findOne({ id: taskData.user_id });
  const project = await Project.findOne({ id: taskData.project_id });
  if (!user || !project) {
    throw new Error("Invalid user_id or project_id");
  }

  // Assign user_name and project_name
  const newTask = new Task({
    ...taskData,
    user_name: user.name,
    project_name: project.name
  });
  return await newTask.save();
};

// Find all tasks
const findAllTasks = async (): Promise<ITask[]> => {
  return await Task.find();
};

// Delete a task by ID
const deleteByTaskId = async (id: string): Promise<ITask | null> => {
  return await Task.findOneAndDelete({ id });
};

// Find a task by ID
const findTaskById = async (id: string): Promise<ITask | null> => {
  return await Task.findOne({ id });
};

// Find tasks by project with pagination and filters
const findTasksByProject = async (aggregationPipeline: any[]): Promise<any> => {
  const taskGroups = await Task.aggregate(aggregationPipeline);
  return taskGroups;
};

// Find tasks by user with pagination and filters
const findTasksByUser = async (aggregationPipeline: any[]): Promise<any> => {
  const taskGroups = await Task.aggregate(aggregationPipeline);
  return taskGroups;
};

// Get task count grouped by status
const findTaskCountByStatus = async (): Promise<Record<string, number>> => {
  const taskCounts = await Task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const defaultStatuses: Record<string, number> = Object.values(TASK_STATUS).reduce(
    (acc: Record<string, number>, status: string) => {
      acc[status] = 0;
      return acc;
    },
    {}
  );

  return taskCounts.reduce((acc: Record<string, number>, item) => {
    acc[item._id] = item.count;
    return acc;
  }, defaultStatuses);
};

// Update task
const updateATask = async (id: string, updateData: Partial<ITask>): Promise<ITask | null> => {
  try {
    const existingTask = await Task.findOne({ id });
    if (!existingTask) return null;

    const { loginuser_id, loginuser_name } = updateData;

    const historyEntry = generateHistoryEntry(existingTask, updateData);
    if (!existingTask.history) existingTask.history = [];

    if (historyEntry) {
      const TaskHistoryModel = mongoose.model<ITaskHistory>("TaskHistory", TaskHistorySchema);
      const historyItem = new TaskHistoryModel({
        id: uuidv4(),
        task_id: id,
        loginuser_id,
        loginuser_name,
        formatted_history: historyEntry,
        created_date: new Date()
      });
      existingTask.history.unshift(historyItem);
    }

    // Set estimated_time only if user_estimated is provided
    if (updateData.user_estimated) {
      existingTask.estimated_time = updateData.user_estimated;
    }

    // Apply all updates
    Object.assign(existingTask, updateData);
    await existingTask.save();
    return existingTask;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to update Task details");
  }
};

// Create a comment in task
const createCommentInTask = async (commentData: ITaskComment): Promise<ITaskComment> => {
  const { task_id, user_id, comment, user_name } = commentData;

  const task = await Task.findOne({ id: task_id });
  if (!task) throw new Error("Task not found");

  const newComment = new TaskComment({ task_id, user_id, comment, user_name });
  await newComment.save();

  if (!task.comment) {
    task.comment = [];
  }

  task.comment.unshift(newComment);
  await task.save();

  return newComment;
};

// Update comment in task
const updateCommentInTask = async (
  id: string,
  newCommentText: Partial<ITaskComment>
): Promise<ITaskComment | null> => {
  const updatedComment = await TaskComment.findOneAndUpdate({ id }, newCommentText, { new: true });
  if (!updatedComment) return null;

  await Task.updateOne(
    { "comment.id": id },
    { $set: { "comment.$.comment": newCommentText.comment } }
  );

  return updatedComment;
};

// Delete comment from task
const deleteCommentFromTask = async (id: string): Promise<ITaskComment | null> => {
  // First, find the comment to get its data before deletion
  const commentToDelete = await TaskComment.findOne({ id });
  if (!commentToDelete) return null;

  // Delete the comment from TaskComment collection
  const deletedComment = await TaskComment.findOneAndDelete({ id });
  if (!deletedComment) return null;

  // Remove the comment from the Task's comment array
  await Task.updateOne({ "comment.id": id }, { $pull: { comment: { id: id } } });

  return deletedComment;
};

//Add time log
const addTimeSpentToTask = async (
  id: string,
  timeEntries: ITimeSpentEntry[]
): Promise<ITask | null> => {
  const task = await Task.findOne({ id });
  if (!task) return null;

  if (!task.time_spent) task.time_spent = [];

  const entries = Array.isArray(timeEntries) ? timeEntries : [timeEntries];
  let delayHours = 0;

  for (const entry of entries) {
    // Calculate time_logged if start_time and end_time are provided
    if (entry.start_time && entry.end_time) {
      entry.time_logged = TimeUtil.calculateTimeLoggedFromStartEnd(
        entry.start_time,
        entry.end_time
      );
    } else if (TIME_FORMAT_PATTERNS.STANDARD_TIME.test(entry.time_logged)) {
      const totalHours = TimeUtil.parseHourMinuteString(entry.time_logged);
      entry.time_logged = TimeUtil.formatHoursToTimeString(totalHours);
    }

    // Validate time format
    if (!TimeUtil.isValidTimeFormat(entry.time_logged)) {
      throw new Error("Invalid time format. Use format like '2d4h', '3d', or '6h'");
    }

    // If due_date is defined, check for delay
    if (task.due_date) {
      const entryDate = new Date(entry.date);
      const dueDate = new Date(task.due_date);

      if (entryDate > dueDate) {
        const diffMs = entryDate.getTime() - dueDate.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // calendar days
        const delayHoursForThisEntry = diffDays * 8; // 8 working hours per day
        delayHours += delayHoursForThisEntry;
      }
    }

    // Add entry to time_spent
    task.time_spent.unshift({
      ...entry,
      start_time: entry.start_time,
      end_time: entry.end_time
    });
  }

  // Recalculate total time, remaining, and variation
  const totalTimeInHours = TimeUtil.calculateTotalTime(task.time_spent);
  task.time_spent_total = TimeUtil.formatHoursToTimeString(totalTimeInHours);
  task.remaining_time = TimeUtil.calculateRemainingTime(task.estimated_time, task.time_spent_total);
  task.variation = TimeUtil.calculateVariation(task.estimated_time, task.time_spent_total);

  // If there's delay, overwrite variation to show delay only
  if (delayHours > 0) {
    const delayString = TimeUtil.formatHoursToTimeString(delayHours);
    task.variation = delayString;
  } else {
    task.variation = "0d0h";
  }

  await task.save();
  return task;
};

export {
  createNewTask,
  deleteByTaskId,
  findAllTasks,
  findTaskById,
  findTasksByProject,
  findTasksByUser,
  findTaskCountByStatus,
  updateATask,
  createCommentInTask,
  updateCommentInTask,
  addTimeSpentToTask,
  deleteCommentFromTask
};
