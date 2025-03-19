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

    const aggregationPipeline: any[] = [
      { $sort: { updatedAt: -1 } }, // Step 1: Sort tasks by most recent first
      {
        $group: {
          _id: "$project_name",
          tasks: { $push: "$$ROOT" }, // Step 2: Push all tasks into the project
          total_count: { $sum: 1 },
          latestTaskUpdatedAt: { $max: "$updatedAt" }, // Step 3: Store the most recent task's timestamp
        },
      },
      {
        $sort: { latestTaskUpdatedAt: -1 }, // Step 4: Sort projects by the latest task's creation date
      },
      {
        $project: {
          _id: 1,
          total_count: 1,
          latestTaskUpdatedAt: 1, // Keep this for debugging
          tasks: {
            $slice: [
              {
                $sortArray: { input: "$tasks", sortBy: { updatedAt: -1 } }, // Step 5: Ensure tasks inside each project are sorted
              },
              0,
              pageSize,
            ],
          },
        },
      },
      { $skip: skip }, // Step 6: Paginate projects
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

    const aggregationPipeline: any[] = [
      { $sort: { updatedAt: -1 } }, // Step 1: Sort tasks globally by most recent
      {
        $group: {
          _id: "$assigned_to",
          tasks: { $push: "$$ROOT" }, // Step 2: Push all tasks assigned to the user
          total_count: { $sum: 1 },
          latestTaskUpdatedAt: { $max: "$updatedAt" }, // Step 3: Store the most recent task’s timestamp
        },
      },
      { $sort: { latestTaskUpdatedAt: -1 } }, // Step 4: Sort users by their most recent task
      {
        $project: {
          _id: 1,
          total_count: 1,
          latestTaskUpdatedAt: 1, // Optional: Keep this for debugging
          tasks: {
            $slice: [
              {
                $sortArray: { input: "$tasks", sortBy: { updatedAt: -1 } }, // Step 5: Ensure tasks inside each user group are sorted
              },
              0,
              pageSize,
            ],
          },
        },
      },
      { $skip: skip }, // Step 6: Paginate user groups
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

  // Get a task by ID
  static async getTaskById(id: string): Promise<ITask | null> {
    return await Task.findOne({ id });
  }

  // Update task details
  static async updateTask(id: string, updateData: Partial<ITask>): Promise<ITask | null> {
    return await Task.findOneAndUpdate({ id }, updateData, { new: true });
  }
}
