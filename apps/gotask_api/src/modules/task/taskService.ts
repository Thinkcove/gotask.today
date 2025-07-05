import TaskMessages from "../../constants/apiMessages/taskMessage";
import { SortField, SortOrder, TASK_STATUS } from "../../constants/taskConstant";
import { TimeUtil } from "../../constants/utils/timeUtils";
import {
  addTimeSpentToTask,
  createCommentInTask,
  createNewTask,
  deleteByTaskId,
  deleteCommentFromTask,
  findAllTasks,
  findTaskById,
  getTaskCountBySeverity,
  getTaskCountByStatus,
  updateATask,
  updateCommentInTask
} from "../../domain/interface/task/taskInterface";
import { Project } from "../../domain/model/project/project";
import { ITask, Task } from "../../domain/model/task/task";
import { ITaskComment } from "../../domain/model/task/taskComment";
import { ITimeSpentEntry } from "../../domain/model/task/timespent";
import { User } from "../../domain/model/user/user";

// Create a new task
const createTask = async (
  taskData: Partial<ITask>
): Promise<{ success: boolean; data?: ITask; message?: string }> => {
  try {
    if (!taskData || !taskData.title || !taskData.project_id) {
      return {
        success: false,
        message: TaskMessages.CREATE.REQUIRED
      };
    }

    // story_id is optional — no need to validate here
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
  search_vals?: any[][],
  search_vars?: string[][],
  min_date?: string,
  max_date?: string,
  date_var?: string,
  more_variation?: string,
  less_variation?: string,
  sortField?: SortField,
  sortOrder: SortOrder = SortOrder.DESC
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const skip = (page - 1) * pageSize;
    const andConditions: any[] = [];

    const isValidSearch = (arr: any[][] | undefined): arr is any[][] =>
      Array.isArray(arr) && arr.length > 0 && Array.isArray(arr[0]) && arr[0].length > 0;

    // Step 1: Group all values by field
    const fieldGroups: Record<string, RegExp[]> = {};

    if (isValidSearch(search_vars) && isValidSearch(search_vals)) {
      for (let i = 0; i < search_vars.length; i++) {
        const rawField = search_vars[i][0];
        const value = search_vals[i][0];
        const field = rawField === "id" ? "project_id" : rawField;
        const regex = new RegExp(value, "i");

        if (!fieldGroups[field]) {
          fieldGroups[field] = [];
        }

        fieldGroups[field].push(regex);
      }
    }

    // Step 2: Build AND filter with single or multiple values
    for (const field in fieldGroups) {
      const regexes = fieldGroups[field];
      if (regexes.length === 1) {
        andConditions.push({ [field]: regexes[0] });
      } else {
        andConditions.push({ [field]: { $in: regexes } });
      }
    }

    // Step 3: Add date filter if provided
    if (date_var && min_date && max_date) {
      andConditions.push({
        [date_var]: {
          $gte: new Date(min_date),
          $lte: new Date(max_date)
        }
      });
    }

    // Step 4: Add variation filters
    if (more_variation?.length && !more_variation.startsWith("-")) {
      andConditions.push({
        variation: { $regex: new RegExp(`^${more_variation}`, "i") }
      });
    }

    if (less_variation?.length && less_variation.startsWith("-")) {
      andConditions.push({
        variation: { $regex: new RegExp(`^${less_variation}`, "i") }
      });
    }

    const filter = andConditions.length > 0 ? { $and: andConditions } : {};

    // Step 5: Determine sort fields
    const sortObject = sortField
      ? { [sortField]: sortOrder === SortOrder.ASC ? 1 : -1 }
      : { due_date: -1, user_name: 1 }; // default sort

    // Step 6: Build aggregation pipeline
    const aggregationPipeline: any[] = [
      { $match: filter },
      { $sort: sortObject },
      {
        $group: {
          _id: "$project_id",
          tasks: { $push: "$$ROOT" },
          total_count: { $sum: 1 },
          latestTaskUpdatedAt: { $max: "$createdAt" }
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "id",
          as: "project"
        }
      },
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { latestTaskUpdatedAt: -1 } },
      {
        $project: {
          _id: 0,
          id: "$_id",
          project_name: "$project.name",
          total_count: 1,
          latestTaskUpdatedAt: 1,
          tasks: {
            $sortArray: {
              input: "$tasks",
              sortBy: sortObject
            }
          }
        }
      },
      { $skip: skip },
      { $limit: pageSize }
    ];

    // Step 7: Execute aggregation and count
    const taskGroups = await Task.aggregate(aggregationPipeline);

    await Promise.all(
      taskGroups.map(async (group) => {
        await Promise.all(
          group.tasks.map(async (task: any) => {
            if (task.user_id && task.user_name) {
              const user = await User.findOne({ id: task.user_id }, { name: 1 }).lean();
              if (user) {
                task.user_name = user.name;
              }
            }

            if (task.project_id && task.project_name) {
              const project = await Project.findOne({ id: task.project_id }, { name: 1 }).lean();
              if (project) {
                task.project_name = project.name;
              }
            }
          })
        );

        if (group.project_name && group._id) {
          const project = await Project.findOne({ id: group._id }, { name: 1 }).lean();
          if (project) {
            group.project_name = project.name;
          }
        }
      })
    );

    const totalProjects = await Task.distinct("project_id", filter).then((res) => res.length);

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
  search_vals?: any[][],
  search_vars?: string[][],
  min_date?: string,
  max_date?: string,
  date_var?: string,
  more_variation?: string,
  less_variation?: string,
  sortField?: SortField,
  sortOrder: SortOrder = SortOrder.ASC
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const skip = (page - 1) * pageSize;
    const andConditions: any[] = [];

    const isValidSearch = (arr: any[][] | undefined): arr is any[][] =>
      Array.isArray(arr) && arr.length > 0 && Array.isArray(arr[0]) && arr[0].length > 0;

    // Step 1: Group all values by field
    const fieldGroups: Record<string, RegExp[]> = {};

    if (isValidSearch(search_vars) && isValidSearch(search_vals)) {
      for (let i = 0; i < search_vars.length; i++) {
        const rawField = search_vars[i][0];
        const value = search_vals[i][0];
        const field = rawField === "id" ? "user_id" : rawField;
        const regex = new RegExp(value, "i");

        if (!fieldGroups[field]) {
          fieldGroups[field] = [];
        }

        fieldGroups[field].push(regex);
      }
    }

    // Step 2: Build AND filter with single or multiple values
    for (const field in fieldGroups) {
      const regexes = fieldGroups[field];
      if (regexes.length === 1) {
        andConditions.push({ [field]: regexes[0] });
      } else {
        andConditions.push({ [field]: { $in: regexes } });
      }
    }

    // Step 3: Add date filter if provided
    if (date_var && min_date && max_date) {
      andConditions.push({
        [date_var]: {
          $gte: new Date(min_date),
          $lte: new Date(max_date)
        }
      });
    }

    // Step 4: Add variation filters
    if (more_variation?.length && !more_variation.startsWith("-")) {
      andConditions.push({
        variation: { $regex: new RegExp(`^${more_variation}`, "i") }
      });
    }

    if (less_variation?.length && less_variation.startsWith("-")) {
      andConditions.push({
        variation: { $regex: new RegExp(`^${less_variation}`, "i") }
      });
    }

    const filter = andConditions.length > 0 ? { $and: andConditions } : {};

    // Step 5: Determine sort fields
    const sortObject = sortField
      ? { [sortField]: sortOrder === SortOrder.ASC ? 1 : -1 }
      : { due_date: -1, user_name: 1 }; // default sort

    // Step 6: Build aggregation pipeline
    const aggregationPipeline: any[] = [
      { $match: filter },
      { $sort: sortObject },
      {
        $group: {
          _id: "$user_id",
          tasks: { $push: "$$ROOT" },
          total_count: { $sum: 1 },
          latestTaskUpdatedAt: { $max: "$createdAt" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { latestTaskUpdatedAt: -1 } },
      {
        $project: {
          _id: 0,
          id: "$_id",
          user_name: "$user.name",
          total_count: 1,
          latestTaskUpdatedAt: 1,
          tasks: {
            $sortArray: {
              input: "$tasks",
              sortBy: sortObject
            }
          }
        }
      },
      { $skip: skip },
      { $limit: pageSize }
    ];

    // Step 7: Execute aggregation and count
    const taskGroups = await Task.aggregate(aggregationPipeline);

    await Promise.all(
      taskGroups.map(async (group) => {
        await Promise.all(
          group.tasks.map(async (task: any) => {
            if (task.user_id && task.user_name) {
              const user = await User.findOne({ id: task.user_id }, { name: 1 }).lean();
              if (user) {
                task.user_name = user.name;
              }
            }

            if (task.project_id && task.project_name) {
              const project = await Project.findOne({ id: task.project_id }, { name: 1 }).lean();
              if (project) {
                task.project_name = project.name;
              }
            }
          })
        );

        if (group.user_name && group._id) {
          const user = await User.findOne({ id: group._id }, { name: 1 }).lean();
          if (user) {
            group.user_name = user.name;
          }
        }
      })
    );

    const totalUsers = await Task.distinct("user_id", filter).then((res) => res.length);

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
const getDashboardSummary = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const [statusCounts, severityCounts, totalCount, completedCount, overdueCount, upcomingCount] =
      await Promise.all([
        getTaskCountByStatus(),
        getTaskCountBySeverity(),
        Task.countDocuments({}),
        Task.countDocuments({ status: TASK_STATUS.COMPLETED }),
        Task.countDocuments({
          due_date: { $lt: new Date() },
          status: { $ne: TASK_STATUS.COMPLETED }
        }),
        Task.countDocuments({
          due_date: {
            $gte: new Date(),
            $lte: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
          } // 7 days
        })
      ]);

    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      success: true,
      data: {
        statusCounts: statusCounts.data,
        severityCounts,
        totalCount,
        completedCount,
        progress,
        overdueCount,
        upcomingCount
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch dashboard data"
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

// Delete a comment for a task
const deleteComment = async (
  id: string
): Promise<{ success: boolean; data?: ITaskComment | null; message?: string }> => {
  try {
    const deletedComment = await deleteCommentFromTask(id);
    if (!deletedComment) {
      return {
        success: false,
        message: TaskMessages.COMMENT.NOT_FOUND
      };
    }
    return {
      success: true,
      data: deletedComment,
      message: TaskMessages.COMMENT.DELETE_SUCCESS
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || TaskMessages.COMMENT.DELETE_FAILED
    };
  }
};

// Add time spent
const addTimeSpent = async (
  id: string,
  timeEntries: ITimeSpentEntry | ITimeSpentEntry[]
): Promise<{ success: boolean; data?: Partial<ITask>; message?: string }> => {
  try {
    const entriesArray = Array.isArray(timeEntries) ? timeEntries : [timeEntries];

    const updatedTask = await addTimeSpentToTask(id, entriesArray);

    if (!updatedTask) {
      return { success: false, message: TaskMessages.TIME_SPENT.NOT_FOUND };
    }

    // Ensure estimated_time is formatted with minutes
    const formattedEstimatedTime = TimeUtil.formatHoursToTimeString(
      TimeUtil.parseTimeString(updatedTask.estimated_time)
    );

    return {
      success: true,
      data: {
        time_spent: updatedTask.time_spent,
        estimated_time: formattedEstimatedTime,
        remaining_time: updatedTask.remaining_time,
        time_spent_total: updatedTask.time_spent_total,
        variation: updatedTask.variation
      }
    };
  } catch (error: any) {
    return { success: false, message: error.message || TaskMessages.TIME_SPENT.ADD_FAILED };
  }
};

export {
  createTask,
  deleteTaskById,
  getAllTasks,
  getTasksByProject,
  getTasksByUser,
  getTaskCountByStatus,
  getDashboardSummary,
  getTaskById,
  updateTask,
  createComment,
  updateComment,
  deleteComment,
  addTimeSpent
};
