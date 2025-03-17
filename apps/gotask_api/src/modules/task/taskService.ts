import { TASK_STATUS } from "../../constants/taskConstant";
import { ITask } from "../../domain/interface/task";
import { Task } from "../../domain/model/task";

export class TaskService {
  // Create a new task
  static async createTask(taskData: ITask): Promise<ITask> {
    const newTask = new Task(taskData);
    return await newTask.save();
  }

  // Get all tasks
  static async getAllTasks(): Promise<ITask[]> {
    return await Task.find();
  }

  // Group tasks by project with pagination
  static async getTaskByProject(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const aggregationPipeline = [
      {
        $group: {
          _id: "$project_name",
          tasks: { $push: "$$ROOT" },
          total_count: { $sum: 1 },
        },
      },
      { $skip: skip },
      { $limit: pageSize },
    ];

    const taskGroups = await Task.aggregate(aggregationPipeline);
    const totalProjects = await Task.distinct("project_name").then((res) => res.length);

    return {
      taskbyprojects: taskGroups,
      total_count: totalProjects,
      total_pages: Math.ceil(totalProjects / pageSize),
      current_page: page,
    };
  }

  // Group tasks by user with pagination
  static async getTaskByUser(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const aggregationPipeline = [
      {
        $group: {
          _id: "$assigned_to",
          tasks: { $push: "$$ROOT" },
          total_count: { $sum: 1 },
        },
      },
      { $skip: skip },
      { $limit: pageSize },
    ];

    const taskGroups = await Task.aggregate(aggregationPipeline);
    const totalUsers = await Task.distinct("assigned_to").then((res) => res.length);

    return {
      taskbyusers: taskGroups,
      total_count: totalUsers,
      total_pages: Math.ceil(totalUsers / pageSize),
      current_page: page,
    };
  }

  // Get task count grouped by status
  static async getTaskCountByStatus() {
    const taskCounts = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const defaultStatuses: Record<string, number> = Object.values(TASK_STATUS).reduce(
      (acc: Record<string, number>, status: string) => {
        acc[status] = 0;
        return acc;
      },
      {},
    );

    return taskCounts.reduce((acc: Record<string, number>, item) => {
      acc[item._id] = item.count;
      return acc;
    }, defaultStatuses);
  }
}
