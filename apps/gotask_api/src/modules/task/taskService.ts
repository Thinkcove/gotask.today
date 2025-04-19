import mongoose from "mongoose";
import { TASK_STATUS } from "../../constants/taskConstant";
import { generateHistoryEntry } from "../../constants/utils.ts/taskHistory";
import { Project } from "../../domain/model/project";
import { ITask, Task } from "../../domain/model/task/task";
import { User } from "../../domain/model/user";
import { v4 as uuidv4 } from "uuid";
import { ITaskHistory, TaskHistorySchema } from "../../domain/model/task/taskHistory";
// import { TimeUtil } from "../../constants/utils.ts/timeUtils";
// taskService.ts
import { TimeUtil } from "../../constants/utils.ts/timeUtils";
import { ITimeSpentEntry } from "../../domain/model/task/task";

import { ITaskComment, TaskComment } from "../../domain/model/task/taskComment";

export class TaskService {
  static async createTask(taskData: Partial<ITask>): Promise<ITask> {
    const user = await User.findOne({ id: taskData.user_id });
    const project = await Project.findOne({ id: taskData.project_id });
    if (!user || !project) {
      throw new Error("Invalid user_id or project_id");
    }

    const createdOn = new Date(taskData.created_on!);
    const dueDate = new Date(taskData.due_date!);

    if (isNaN(createdOn.getTime()) || isNaN(dueDate.getTime())) {
      throw new Error("Invalid created_on or due_date");
    }

    const createdUTC = Date.UTC(createdOn.getFullYear(), createdOn.getMonth(), createdOn.getDate());
    const dueUTC = Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

    // Inclusive: count both start and end dates
    let daysDiff = Math.floor((dueUTC - createdUTC) / (1000 * 60 * 60 * 24)) + 1;
    let estimatedTime = daysDiff > 0 ? `${daysDiff}d0h` : "1d0h"; // fallback

    const newTask = new Task({
      ...taskData,
      user_name: user.name,
      project_name: project.name,
      estimated_time: estimatedTime
    });
    return await newTask.save();
  }

  // Get all tasks
  static async getAllTasks(): Promise<ITask[]> {
    return await Task.find();
  }

  // Group tasks by project with pagination
  static async getTaskByProject(
    page: number,
    pageSize: number,
    taskPage: number,
    taskPageSize: number,
    search_vals?: any[][],
    search_vars?: string[][]
  ) {
    const skip = (page - 1) * pageSize;
    const taskSkip = (taskPage - 1) * taskPageSize;
    // Construct filter object dynamically
    let filter: any = {};
    if (search_vars && search_vals) {
      search_vars.forEach((vars, index) => {
        vars.forEach((field, fieldIndex) => {
          const fieldName = field === "id" ? "project_id" : field;
          filter[fieldName] = search_vals[index][fieldIndex];
        });
      });
    }

    const aggregationPipeline: any[] = [
      { $match: filter }, // Step 1: Filter projects correctly
      { $sort: { updatedAt: -1 } }, // Step 2: Sort tasks by most recent first
      {
        $group: {
          _id: { id: "$project_id", project_name: "$project_name" }, // Group by project_id and project_name
          tasks: { $push: "$$ROOT" },
          total_count: { $sum: 1 },
          latestTaskUpdatedAt: { $max: "$updatedAt" }
        }
      },
      { $sort: { latestTaskUpdatedAt: -1 } }, // Step 3: Sort projects by latest task's update time
      {
        $project: {
          _id: 0,
          id: "$_id.id",
          project_name: "$_id.project_name",
          total_count: 1,
          latestTaskUpdatedAt: 1,
          task_total_pages: { $ceil: { $divide: ["$total_count", taskPageSize] } },
          tasks: {
            $slice: [
              {
                $sortArray: { input: "$tasks", sortBy: { updatedAt: -1 } }
              },
              taskSkip,
              taskPageSize
            ]
          }
        }
      },
      { $skip: skip }, // Step 4: Paginate projects
      { $limit: pageSize }
    ];

    const taskGroups = await Task.aggregate(aggregationPipeline);
    const totalProjects = await Task.distinct("project_name", filter).then((res) => res.length);

    return {
      taskbyprojects: taskGroups,
      total_count: totalProjects,
      total_pages: Math.ceil(totalProjects / pageSize),
      current_page: page
    };
  }

  // Group tasks by user with pagination
  static async getTaskByUser(
    page: number,
    pageSize: number,
    taskPage: number,
    taskPageSize: number,
    search_vals?: any[][],
    search_vars?: string[][]
  ) {
    const skip = (page - 1) * pageSize;
    const taskSkip = (taskPage - 1) * taskPageSize;
    // Construct filter object dynamically

    let filter: any = {};
    if (search_vars && search_vals) {
      search_vars.forEach((vars, index) => {
        vars.forEach((field, fieldIndex) => {
          const fieldName = field === "id" ? "user_id" : field;
          filter[fieldName] = search_vals[index][fieldIndex];
        });
      });
    }

    const aggregationPipeline: any[] = [
      { $match: filter }, // Step 1: Filter projects correctly
      { $sort: { updatedAt: -1 } }, // Step 2: Sort tasks globally by most recent
      {
        $group: {
          _id: { id: "$user_id", user_name: "$user_name" }, // Group by project_id and project_name
          tasks: { $push: "$$ROOT" }, // Step 2: Push all tasks assigned to the user
          total_count: { $sum: 1 },
          latestTaskUpdatedAt: { $max: "$updatedAt" } // Step 3: Store the most recent task’s timestamp
        }
      },
      { $sort: { latestTaskUpdatedAt: -1 } }, // Step 4: Sort users by their most recent task
      {
        $project: {
          _id: 0,
          id: "$_id.id",
          user_name: "$_id.user_name",
          total_count: 1,
          latestTaskUpdatedAt: 1, // Optional: Keep this for debugging
          task_total_pages: { $ceil: { $divide: ["$total_count", taskPageSize] } }, // Calculate total pages for tasks
          tasks: {
            $slice: [
              {
                $sortArray: { input: "$tasks", sortBy: { updatedAt: -1 } } // Step 5: Ensure tasks inside each user group are sorted
              },
              taskSkip,
              taskPageSize
            ]
          }
        }
      },
      { $skip: skip }, // Step 6: Paginate user groups
      { $limit: pageSize }
    ];

    const taskGroups = await Task.aggregate(aggregationPipeline);
    const totalUsers = await Task.distinct("user_name", filter).then((res) => res.length);

    return {
      taskbyusers: taskGroups,
      total_count: totalUsers,
      total_pages: Math.ceil(totalUsers / pageSize),
      current_page: page
    };
  }

  // Get task count grouped by status
  static async getTaskCountByStatus() {
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
  }

  // Get a task by ID
  static async getTaskById(id: string): Promise<ITask | null> {
    return await Task.findOne({ id });
  }

  // Update task details
  static async updateTask(id: string, updateData: Partial<ITask>): Promise<ITask | null> {
    try {
      const existingTask = await Task.findOne({ id });
      if (!existingTask) return null;
      const { loginuser_id, loginuser_name } = updateData;
      const historyEntry = generateHistoryEntry(existingTask, updateData);
      if (!existingTask.history) {
        existingTask.history = [];
      }
      if (historyEntry) {
        const historyItem = new (mongoose.model<ITaskHistory>("TaskHistory", TaskHistorySchema))({
          id: uuidv4(),
          task_id: id,
          loginuser_id,
          loginuser_name,
          formatted_history: historyEntry,
          created_date: new Date()
        });
        existingTask.history.unshift(historyItem);
      }
      // Update the task with new data
      Object.assign(existingTask, updateData);
      await existingTask.save();
      return existingTask;
    } catch (error) {
      console.error("Task update failed:", error);
      throw new Error("Failed to update Task details");
    }
  }

  // Create a new comment
  static async createComment(commentData: ITaskComment) {
    const { task_id, user_id, comment, user_name } = commentData;
    const task = await Task.findOne({ id: task_id });
    if (!task) throw new Error("Task not found");
    const newComment = new TaskComment({ task_id: task_id, user_id: user_id, comment, user_name });
    await newComment.save();
    // Ensure task.comment is initialized
    if (!task.comment) {
      task.comment = [];
    }
    task.comment.unshift(newComment);
    await task.save();
    return newComment;
  }

  //update comment field
  static async updateComment(
    id: string,
    newCommentText: Partial<ITaskComment>
  ): Promise<ITaskComment | null> {
    // Step 1: Update the comment in TaskComment collection
    const updatedComment = await TaskComment.findOneAndUpdate({ id }, newCommentText, {
      new: true
    });
    if (!updatedComment) return null;
    // Step 2: Update the embedded comment inside the Task collection
    await Task.updateOne(
      { "comment.id": id }, // Find the task that contains this comment ID
      { $set: { "comment.$.comment": newCommentText.comment } } // Update comment text
    );
    return updatedComment;
  }

  // Add time spent to a task
  static async addTimeSpent(
    id: string,
    timeEntries: ITimeSpentEntry | ITimeSpentEntry[]
  ): Promise<ITask | null> {
    try {
      const task = await Task.findOne({ id });
      if (!task) return null;

      if (!Array.isArray(timeEntries)) {
        timeEntries = [timeEntries];
      }

      if (!task.time_spent) {
        task.time_spent = [];
      }

      for (const entry of timeEntries) {
        // Validate time format
        if (!TimeUtil.isValidTimeFormat(entry.time_logged)) {
          throw new Error("Invalid time format. Use format like '2d4h', '3d', or '6h'");
        }

        task.time_spent.push(entry);
      }

      // Calculate total time spent
      const totalTimeInHours = TimeUtil.calculateTotalTime(task.time_spent);
      task.time_spent_total = TimeUtil.formatHoursToTimeString(totalTimeInHours);

      // Calculate remaining time
      task.remaining_time = TimeUtil.calculateRemainingTime(
        task.estimated_time,
        task.time_spent_total
      );

      await task.save();
      return task;
    } catch (error) {
      console.error("Failed to add time spent:", error);
      throw new Error("Failed to add time spent to the task");
    }
  }

  // Update estimated time for a task
  static async updateEstimatedTime(id: string, estimatedTime: string): Promise<ITask | null> {
    try {
      console.log("Finding task with ID:", id);
      const task = await Task.findOne({ id });
      if (!task) return null;
      console.log("Task not found for ID:", id);

      // Validate time format
      if (!TimeUtil.isValidTimeFormat(estimatedTime)) {
        console.log("Invalid estimated time format:", estimatedTime);
        throw new Error("Invalid time format. Use format like '2d4h', '3d', or '6h'");
      }

      task.estimated_time = estimatedTime;
      console.log("Updated estimated time:", estimatedTime);

      // Recalculate remaining time
      task.remaining_time = TimeUtil.calculateRemainingTime(
        task.estimated_time,
        task.time_spent_total
      );
      console.log("Recalculated remaining time:", task.remaining_time);

      await task.save();
      console.log("Task saved after updating estimated time!");
      return task;
    } catch (error) {
      console.error("Failed to update estimated time:", error);
      throw new Error("Failed to update estimated time for the task");
    }
  }
  static async getTimeTrackingSummary(taskId: string) {
    console.log("Fetching time tracking summary for task ID:", taskId);
    const task = await Task.findById(taskId);
    if (!task) return null;
    console.log("Task not found for ID:", taskId);

    return {
      estimated_time: task.estimated_time,
      time_spent_total: task.time_spent_total,
      remaining_time: task.remaining_time,
      time_spent: task.time_spent // array of entries like [{ date, time_logged }]
    };
  }
}
