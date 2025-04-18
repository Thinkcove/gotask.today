import TaskMessages from "../../constants/apiMessages/taskMessage";
import {
  createCommentInTask,
  createNewTask,
  deleteByTaskId,
  findAllTasks,
  findTaskById,
  findTaskCountByStatus,
  findTasksByProject,
  findTasksByUser,
  updateATask,
  updateCommentInTask
} from "../../domain/interface/task/taskInterface";
import { ITask, Task } from "../../domain/model/task/task";
import { ITaskComment } from "../../domain/model/task/taskComment";

// Create a new task
const createTask = async (
  taskData: Partial<ITask>
): Promise<{ success: boolean; data?: ITask; message?: string }> => {
  try {
    if (!taskData) {
      return {
        success: false,
        message: TaskMessages.CREATE.REQUIRED
      };
    }
    const newTask = await createNewTask(taskData);
    return {
      success: true,
      data: newTask
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || TaskMessages.CREATE.FAILED
    };
  }
};

// Get all tasks
const getAllTasks = async (): Promise<{
  success: boolean;
  data?: ITask[];
  message?: string;
}> => {
  try {
    const tasks = await findAllTasks();
    return {
      success: true,
      data: tasks
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || TaskMessages.FETCH.FAILED_ALL
    };
  }
};

const deleteTaskById = async (
  id: string
): Promise<{ success: boolean; data?: ITask | null; message?: string }> => {
  try {
    const deletedTask = await deleteByTaskId(id);
    if (!deletedTask) {
      return {
        success: false,
        message: TaskMessages.DELETE.NOT_FOUND
      };
    }
    return {
      success: true,
      message: TaskMessages.DELETE.SUCCESS
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || TaskMessages.DELETE.FAILED
    };
  }
};

// Get tasks by project with pagination
const getTasksByProject = async (
  page: number,
  pageSize: number,
  taskPage: number,
  taskPageSize: number,
  search_vals?: any[][],
  search_vars?: string[][]
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const skip = (page - 1) * pageSize;
    const taskSkip = (taskPage - 1) * taskPageSize;

    let filter: any = {};
    if (search_vars && search_vals) {
      const orConditions: any[] = [];
      for (let i = 0; i < search_vars.length; i++) {
        const field = search_vars[i][0];
        const value = search_vals[i][0];
        const fieldName = field === "id" ? "project_id" : field;
        orConditions.push({ [fieldName]: { $regex: new RegExp(value, "i") } });
      }
      filter = orConditions.length === 1 ? orConditions[0] : { $or: orConditions };
    }

    const aggregationPipeline: any[] = [
      { $match: filter },
      { $sort: { updatedAt: -1 } },
      {
        $group: {
          _id: { id: "$project_id", project_name: "$project_name" },
          tasks: { $push: "$$ROOT" },
          total_count: { $sum: 1 },
          latestTaskUpdatedAt: { $max: "$updatedAt" }
        }
      },
      { $sort: { latestTaskUpdatedAt: -1 } },
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
              { $sortArray: { input: "$tasks", sortBy: { updatedAt: -1 } } },
              taskSkip,
              taskPageSize
            ]
          }
        }
      },
      { $skip: skip },
      { $limit: pageSize }
    ];

    const taskGroups = await findTasksByProject(aggregationPipeline);

    // Calculate total project count based on filter
    const totalProjects = await Task.distinct("project_name", filter).then((res) => res.length);

    return {
      success: true,
      data: {
        taskbyprojects: taskGroups,
        total_count: totalProjects,
        total_pages: Math.ceil(totalProjects / pageSize),
        current_page: page
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || TaskMessages.FETCH.FAILED_BY_PROJECT
    };
  }
};

// Get tasks by user with pagination
const getTasksByUser = async (
  page: number,
  pageSize: number,
  taskPage: number,
  taskPageSize: number,
  search_vals?: any[][],
  search_vars?: string[][]
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const skip = (page - 1) * pageSize;
    const taskSkip = (taskPage - 1) * taskPageSize;

    // Build filter
    let filter: any = {};
    if (search_vars && search_vals) {
      const orConditions: any[] = [];
      for (let i = 0; i < search_vars.length; i++) {
        const field = search_vars[i][0];
        const value = search_vals[i][0];
        const fieldName = field === "id" ? "user_id" : field;
        orConditions.push({ [fieldName]: { $regex: new RegExp(value, "i") } });
      }
      filter = orConditions.length === 1 ? orConditions[0] : { $or: orConditions };
    }

    // Build aggregation pipeline
    const aggregationPipeline: any[] = [
      { $match: filter },
      { $sort: { updatedAt: -1 } },
      {
        $group: {
          _id: { id: "$user_id", user_name: "$user_name" },
          tasks: { $push: "$$ROOT" },
          total_count: { $sum: 1 },
          latestTaskUpdatedAt: { $max: "$updatedAt" }
        }
      },
      { $sort: { latestTaskUpdatedAt: -1 } },
      {
        $project: {
          _id: 0,
          id: "$_id.id",
          user_name: "$_id.user_name",
          total_count: 1,
          latestTaskUpdatedAt: 1,
          task_total_pages: { $ceil: { $divide: ["$total_count", taskPageSize] } },
          tasks: {
            $slice: [
              { $sortArray: { input: "$tasks", sortBy: { updatedAt: -1 } } },
              taskSkip,
              taskPageSize
            ]
          }
        }
      },
      { $skip: skip },
      { $limit: pageSize }
    ];

    const taskGroups = await findTasksByUser(aggregationPipeline);

    const totalUsers = await Task.distinct("user_name", filter).then((res) => res.length);

    return {
      success: true,
      data: {
        taskbyusers: taskGroups,
        total_count: totalUsers,
        total_pages: Math.ceil(totalUsers / pageSize),
        current_page: page
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || TaskMessages.FETCH.FAILED_BY_USER
    };
  }
};

// Get task count grouped by status
const getTaskCountByStatus = async (): Promise<{
  success: boolean;
  data?: Record<string, number>;
  message?: string;
}> => {
  try {
    const taskCounts = await findTaskCountByStatus();
    return {
      success: true,
      data: taskCounts
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || TaskMessages.FETCH.FAILED_COUNTS
    };
  }
};

// Get a task by ID
const getTaskById = async (
  id: string
): Promise<{ success: boolean; data?: ITask | null; message?: string }> => {
  try {
    const task = await findTaskById(id);
    if (!task) {
      return {
        success: false,
        message: TaskMessages.FETCH.NOT_FOUND
      };
    }
    return {
      success: true,
      data: task
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || TaskMessages.FETCH.FAILED_BY_ID
    };
  }
};

// Update task details
const updateTask = async (
  id: string,
  updateData: Partial<ITask>
): Promise<{ success: boolean; data?: ITask | null; message?: string }> => {
  try {
    const updatedTask = await updateATask(id, updateData);
    if (!updatedTask) {
      return {
        success: false,
        message: TaskMessages.UPDATE.NOT_FOUND
      };
    }
    return {
      success: true,
      data: updatedTask
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || TaskMessages.UPDATE.FAILED
    };
  }
};

// Create a new comment for a task
const createComment = async (
  commentData: ITaskComment
): Promise<{ success: boolean; data?: ITaskComment; message?: string }> => {
  try {
    const newComment = await createCommentInTask(commentData);
    return {
      success: true,
      data: newComment
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || TaskMessages.COMMENT.CREATE_FAILED
    };
  }
};

// Update a comment for a task
const updateComment = async (
  id: string,
  newCommentText: Partial<ITaskComment>
): Promise<{ success: boolean; data?: ITaskComment | null; message?: string }> => {
  try {
    const updatedComment = await updateCommentInTask(id, newCommentText);
    if (!updatedComment) {
      return {
        success: false,
        message: TaskMessages.COMMENT.NOT_FOUND
      };
    }
    return {
      success: true,
      data: updatedComment
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || TaskMessages.COMMENT.UPDATE_FAILED
    };
  }
};

export {
  createTask,
  deleteTaskById,
  getAllTasks,
  getTasksByProject,
  getTasksByUser,
  getTaskCountByStatus,
  getTaskById,
  updateTask,
  createComment,
  updateComment
};
