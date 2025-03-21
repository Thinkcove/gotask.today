import { TASK_STATUS } from "../../constants/taskConstant";
import { ITask } from "../../domain/interface/task";
import { Project } from "../../domain/model/project";
import { Task } from "../../domain/model/task";
import { User } from "../../domain/model/user";

export class TaskService {
  // Create a new task
  static async createTask(taskData: Partial<ITask>): Promise<ITask> {
    // Fetch user and project details
    const user = await User.findOne({ id: taskData.user_id });
    const project = await Project.findOne({ id: taskData.project_id });
    if (!user || !project) {
      throw new Error("Invalid user_id or project_id");
    }
    // Assign user_name and project_name
    const newTask = new Task({
      ...taskData,
      user_name: user.name,
      project_name: project.name,
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
    search_vars?: string[][],
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
          latestTaskUpdatedAt: { $max: "$updatedAt" },
        },
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
                $sortArray: { input: "$tasks", sortBy: { updatedAt: -1 } },
              },
              taskSkip,
              taskPageSize,
            ],
          },
        },
      },
      { $skip: skip }, // Step 4: Paginate projects
      { $limit: pageSize },
    ];

    const taskGroups = await Task.aggregate(aggregationPipeline);
    const totalProjects = await Task.distinct("project_name", filter).then((res) => res.length);

    return {
      taskbyprojects: taskGroups,
      total_count: totalProjects,
      total_pages: Math.ceil(totalProjects / pageSize),
      current_page: page,
    };
  }

  // Group tasks by user with pagination
  static async getTaskByUser(
    page: number,
    pageSize: number,
    taskPage: number,
    taskPageSize: number,
  ) {
    const skip = (page - 1) * pageSize;
    const taskSkip = (taskPage - 1) * taskPageSize;

    const aggregationPipeline: any[] = [
      { $sort: { updatedAt: -1 } }, // Step 1: Sort tasks globally by most recent
      {
        $group: {
          _id: { id: "$user_id", user_name: "$user_name" }, // Group by project_id and project_name
          tasks: { $push: "$$ROOT" }, // Step 2: Push all tasks assigned to the user
          total_count: { $sum: 1 },
          latestTaskUpdatedAt: { $max: "$updatedAt" }, // Step 3: Store the most recent task’s timestamp
        },
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
                $sortArray: { input: "$tasks", sortBy: { updatedAt: -1 } }, // Step 5: Ensure tasks inside each user group are sorted
              },
              taskSkip,
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
