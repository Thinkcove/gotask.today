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
import { ProjectStory } from "../../model/projectStory/projectStory";

// Create a new task
const createNewTask = async (taskData: Partial<ITask>): Promise<ITask> => {
  const user = await User.findOne({ id: taskData.user_id });
  const project = await Project.findOne({ id: taskData.project_id });
  if (!user || !project) {
    throw new Error("Invalid user_id or project_id");
  }

  const userEstimated = taskData.user_estimated;

  if (userEstimated) {
    taskData.estimated_time = userEstimated;
  }

  const newTask = new Task({
    ...taskData,
    user_name: user.name,
    project_name: project.name,
    estimated_time: taskData.estimated_time || "0d0h0m"
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

const findTaskById = async (id: string): Promise<any> => {
  const task = await Task.findOne({ id }).lean();
  if (!task) return null;
  const user = await User.findOne({ id: task.created_by }).lean();
  const projectStory = await ProjectStory.findOne({ id: task.story_id });

  return {
    ...task,
    created_by_name: user?.name || null,
    story_name: projectStory?.title || null
  };
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

    if (updateData.user_id && updateData.user_id !== existingTask.user_id) {
      const user = await User.findOne({ id: updateData.user_id });
      if (!user) throw new Error("Invalid user_id");
      updateData.user_name = user.name;
    }

    if (updateData.project_id && updateData.project_id !== existingTask.project_id) {
      const project = await Project.findOne({ id: updateData.project_id });
      if (!project) throw new Error("Invalid project_id");
      updateData.project_name = project.name;
    }

    const historyEntry = generateHistoryEntry(existingTask, updateData);

    if (!existingTask.history) {
      existingTask.history = [];
    }

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

    // Set estimated_time from user_estimated, ensuring minutes are included
    const userEstimated = updateData.user_estimated ?? existingTask.user_estimated;

    if (userEstimated) {
      // Parse user_estimated and reformat to ensure minutes
      const estimatedHours = TimeUtil.parseTimeString(userEstimated);
      existingTask.estimated_time = TimeUtil.formatHoursToTimeString(estimatedHours);
    }

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

// Add time log
const addTimeSpentToTask = async (
  id: string,
  timeEntries: ITimeSpentEntry[]
): Promise<ITask | null> => {
  const task = await Task.findOne({ id });
  if (!task) return null;
  if (!task.time_spent) task.time_spent = [];

  const entries = Array.isArray(timeEntries) ? timeEntries : [timeEntries];

  for (const entry of entries) {
    if (entry.start_time && entry.end_time) {
      entry.time_logged = TimeUtil.calculateTimeLoggedFromStartEnd(
        entry.start_time,
        entry.end_time
      );
    } else if (entry.time_logged && TIME_FORMAT_PATTERNS.STANDARD_TIME.test(entry.time_logged)) {
      const totalHours = TimeUtil.parseHourMinuteString(entry.time_logged);
      entry.time_logged = TimeUtil.formatHoursToTimeString(totalHours);
    }

    if (!TimeUtil.isValidTimeFormat(entry.time_logged)) {
      throw new Error("Invalid time format. Use format like '2d4h', '3d', or '6h'");
    }

    task.time_spent.unshift({
      ...entry,
      start_time: entry.start_time,
      end_time: entry.end_time
    });
  }

  const totalTimeInHours = TimeUtil.calculateTotalTime(task.time_spent);
  task.time_spent_total = TimeUtil.formatHoursToTimeString(totalTimeInHours);

  const formattedEstimatedTime = task.estimated_time
    ? TimeUtil.formatHoursToTimeString(TimeUtil.parseTimeString(task.estimated_time))
    : "0d0h0m";
  task.estimated_time = formattedEstimatedTime;

  task.remaining_time = TimeUtil.calculateRemainingTime(task.estimated_time, task.time_spent_total);
  task.variation = TimeUtil.calculateVariation(task.estimated_time, task.time_spent_total);
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
