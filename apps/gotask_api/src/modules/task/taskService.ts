import TaskMessages from "../../constants/apiMessages/taskMessage";
import { SortField, SortOrder } from "../../constants/taskConstant";
import { TimeUtil } from "../../constants/utils/timeUtils";
import {
  addTimeSpentToTask,
  createCommentInTask,
  createNewTask,
  deleteByTaskId,
  deleteCommentFromTask,
  findAllTasks,
  findTaskById,
  findTaskCountByStatus,
  updateATask,
  updateCommentInTask
} from "../../domain/interface/task/taskInterface";
import { ITask, Task } from "../../domain/model/task/task";
import { ITaskComment } from "../../domain/model/task/taskComment";
import { ITimeSpentEntry } from "../../domain/model/task/timespent";

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

    const fieldGroups: Record<string, RegExp[]> = {};

    if (isValidSearch(search_vars) && isValidSearch(search_vals)) {
      for (let i = 0; i < search_vars.length; i++) {
        const rawField = search_vars[i][0];
        const value = search_vals[i][0];
        const field = rawField === "id" ? "project_id" : rawField;
        const regex = new RegExp(value, "i");

        if (!fieldGroups[field]) fieldGroups[field] = [];
        fieldGroups[field].push(regex);
      }
    }

    for (const field in fieldGroups) {
      const regexes = fieldGroups[field];
      andConditions.push(
        regexes.length === 1 ? { [field]: regexes[0] } : { [field]: { $in: regexes } }
      );
    }

    if (date_var && min_date && max_date) {
      andConditions.push({
        [date_var]: {
          $gte: new Date(min_date),
          $lte: new Date(max_date)
        }
      });
    }

    if (more_variation?.length && !more_variation.startsWith("-")) {
      andConditions.push({ variation: { $regex: new RegExp(`^${more_variation}`, "i") } });
    }

    if (less_variation?.length && less_variation.startsWith("-")) {
      andConditions.push({ variation: { $regex: new RegExp(`^${less_variation}`, "i") } });
    }

    const filter = andConditions.length > 0 ? { $and: andConditions } : {};

    const sortObject = sortField
      ? { [sortField]: sortOrder === SortOrder.ASC ? 1 : -1 }
      : { due_date: -1, user_name: 1 };

    const pipeline: any[] = [
      { $match: filter },

      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "projects",
          localField: "project_id",
          foreignField: "id",
          as: "project"
        }
      },
      { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },

      {
        $addFields: {
          user_name: "$user.name",
          project_name: "$project.name"
        }
      },

      {
        $sort: sortObject
      },

      {
        $group: {
          _id: "$project_id",
          id: { $first: "$project_id" },
          project_name: { $first: "$project.name" },
          latestTaskUpdatedAt: { $max: "$updatedAt" },
          total_count: { $sum: 1 },
          tasks: { $push: "$$ROOT" }
        }
      },

      { $sort: { latestTaskUpdatedAt: -1 } },

      {
        $facet: {
          paginatedResults: [{ $skip: skip }, { $limit: pageSize }],
          total: [{ $count: "count" }]
        }
      }
    ];

    const result = await Task.aggregate(pipeline);

    const taskbyprojects = result[0]?.paginatedResults || [];
    const total_count = result[0]?.total[0]?.count || 0;
    const total_pages = Math.ceil(total_count / pageSize);
    const current_page = page;

    return {
      success: true,
      data: {
        taskbyprojects,
        total_count,
        total_pages,
        current_page
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

    const fieldGroups: Record<string, RegExp[]> = {};

    if (isValidSearch(search_vars) && isValidSearch(search_vals)) {
      for (let i = 0; i < search_vars.length; i++) {
        const rawField = search_vars[i][0];
        const value = search_vals[i][0];
        const field = rawField === "id" ? "user_id" : rawField;
        const regex = new RegExp(value, "i");

        if (!fieldGroups[field]) fieldGroups[field] = [];
        fieldGroups[field].push(regex);
      }
    }

    for (const field in fieldGroups) {
      const regexes = fieldGroups[field];
      andConditions.push(
        regexes.length === 1 ? { [field]: regexes[0] } : { [field]: { $in: regexes } }
      );
    }

    if (date_var && min_date && max_date) {
      andConditions.push({
        [date_var]: {
          $gte: new Date(min_date),
          $lte: new Date(max_date)
        }
      });
    }

    if (more_variation?.length && !more_variation.startsWith("-")) {
      andConditions.push({ variation: { $regex: new RegExp(`^${more_variation}`, "i") } });
    }

    if (less_variation?.length && less_variation.startsWith("-")) {
      andConditions.push({ variation: { $regex: new RegExp(`^${less_variation}`, "i") } });
    }

    const filter = andConditions.length > 0 ? { $and: andConditions } : {};

    const sortObject = sortField
      ? { [sortField]: sortOrder === SortOrder.ASC ? 1 : -1 }
      : { due_date: -1, project_name: 1 };

    const pipeline: any[] = [
      { $match: filter },

      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "projects",
          localField: "project_id",
          foreignField: "id",
          as: "project"
        }
      },
      { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },

      {
        $addFields: {
          user_name: "$user.name",
          project_name: "$project.name"
        }
      },

      {
        $sort: sortObject
      },

      {
        $group: {
          _id: "$user_id",
          id: { $first: "$user_id" },
          user_name: { $first: "$user.name" },
          latestTaskUpdatedAt: { $max: "$updatedAt" },
          total_count: { $sum: 1 },
          tasks: { $push: "$$ROOT" }
        }
      },

      { $sort: { latestTaskUpdatedAt: -1 } },

      {
        $facet: {
          paginatedResults: [{ $skip: skip }, { $limit: pageSize }],
          total: [{ $count: "count" }]
        }
      }
    ];

    const result = await Task.aggregate(pipeline);

    const taskbyusers = result[0]?.paginatedResults || [];
    const total_count = result[0]?.total[0]?.count || 0;
    const total_pages = Math.ceil(total_count / pageSize);
    const current_page = page;

    return {
      success: true,
      data: {
        taskbyusers,
        total_count,
        total_pages,
        current_page
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
  getTaskById,
  updateTask,
  createComment,
  updateComment,
  deleteComment,
  addTimeSpent
};
