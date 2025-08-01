import TaskMessages from "../../constants/apiMessages/taskMessage";
import { SortField, SortOrder, TASK_MODE } from "../../constants/taskConstant";
import { TimeUtil } from "../../constants/utils/timeUtils";
import {
  addTimeSpentToTask,
  createCommentInTask,
  createNewTask,
  deleteByTaskId,
  deleteCommentFromTask,
  findTaskById,
  findTaskCountByStatus,
  updateATask,
  updateCommentInTask
} from "../../domain/interface/task/taskInterface";
import { ITask, Task } from "../../domain/model/task/task";
import { ITaskComment } from "../../domain/model/task/taskComment";
import { ITimeSpentEntry } from "../../domain/model/task/timespent";
import { v4 as uuidv4 } from "uuid";

// Create a new task
const createTask = async (
  taskData: Partial<ITask>
): Promise<{ success: boolean; data?: ITask[]; message?: string }> => {
  try {
    if (!taskData || !taskData.title || !taskData.project_id) {
      return {
        success: false,
        message: TaskMessages.CREATE.REQUIRED
      };
    }

    // Generate IDs for all tasks first
    const mainTaskId = uuidv4();
    const qaTaskId = uuidv4();
    const utcTaskId = uuidv4();

    // Helper: prefix title with mode
    const getPrefixedTitle = (mode?: string) => {
      if (!mode) return taskData.title!;
      return `[${mode}] - ${taskData.title}`;
    };

    // Task 1: Main task with linked_ids pointing to QA and UTC tasks
    const mainTask = {
      ...taskData,
      id: mainTaskId,
      title: getPrefixedTitle(TASK_MODE.DEV),
      linked_ids: [qaTaskId, utcTaskId]
    };

    // Task 2: QA task with linked_ids pointing to main task
    const qaTask = {
      ...taskData,
      id: qaTaskId,
      task_mode: TASK_MODE.QA,
      title: getPrefixedTitle(TASK_MODE.QA),
      linked_ids: [mainTaskId]
    };

    // Task 3: UTC task with linked_ids pointing to main task
    const utcTask = {
      ...taskData,
      id: utcTaskId,
      task_mode: TASK_MODE.UTC,
      title: getPrefixedTitle(TASK_MODE.UTC),
      linked_ids: [mainTaskId]
    };

    // Create all tasks
    const newMainTask = await createNewTask(mainTask);
    const newQaTask = await createNewTask(qaTask);
    const newUtcTask = await createNewTask(utcTask);

    const tasks = [newMainTask, newQaTask, newUtcTask];

    return {
      success: true,
      data: tasks
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
  data?: Partial<ITask>[];
  message?: string;
}> => {
  try {
    const tasks = await Task.find(
      {},
      {
        _id: 1,
        id: 1,
        title: 1,
        description: 1,
        status: 1,
        severity: 1,
        task_mode: 1,
        user_id: 1,
        user_name: 1,
        project_id: 1,
        project_name: 1,
        story_id: 1,
        start_date: 1,
        due_date: 1,
        created_on: 1,
        updated_on: 1,
        estimated_time: 1,
        time_spent_total: 1,
        remaining_time: 1,
        variation: 1,
        createdAt: 1,
        updatedAt: 1,
        actual_start_date: 1,
        actual_end_date: 1
      }
    ).lean();

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

      { $sort: sortObject },

      {
        $group: {
          _id: "$project_id",
          id: { $first: "$project_id" },
          project_name: { $first: "$project.name" },
          latestTaskUpdatedAt: { $max: "$updatedAt" },
          total_count: { $sum: 1 },
          tasks: {
            $push: {
              _id: "$_id",
              id: "$id",
              title: "$title",
              description: "$description",
              status: "$status",
              severity: "$severity",
              user_id: "$user_id",
              user_name: "$user_name",
              project_id: "$project_id",
              project_name: "$project_name",
              story_id: "$story_id",
              start_date: "$start_date",
              due_date: "$due_date",
              created_on: "$created_on",
              user_estimated: "$user_estimated",
              estimated_time: "$estimated_time",
              time_spent_total: "$time_spent_total",
              remaining_time: "$remaining_time",
              variation: "$variation",
              updated_on: "$updated_on",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
              actual_start_date: "$actual_start_date",
              actual_end_date: "$actual_end_date",
              task_mode: "$task_mode",
              linked_ids: { $ifNull: ["$linked_ids", []] }
            }
          }
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
      message: error.message || "Failed to fetch tasks by project"
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

      { $sort: sortObject },

      {
        $group: {
          _id: "$user_id",
          id: { $first: "$user_id" },
          user_name: { $first: "$user.name" },
          latestTaskUpdatedAt: { $max: "$updatedAt" },
          total_count: { $sum: 1 },
          tasks: {
            $push: {
              _id: "$_id",
              id: "$id",
              title: "$title",
              description: "$description",
              status: "$status",
              severity: "$severity",
              user_id: "$user_id",
              user_name: "$user_name",
              project_id: "$project_id",
              project_name: "$project_name",
              story_id: "$story_id",
              start_date: "$start_date",
              due_date: "$due_date",
              created_on: "$created_on",
              user_estimated: "$user_estimated",
              estimated_time: "$estimated_time",
              time_spent_total: "$time_spent_total",
              remaining_time: "$remaining_time",
              variation: "$variation",
              updated_on: "$updated_on",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
              actual_start_date: "$actual_start_date",
              actual_end_date: "$actual_end_date",
              task_mode: "$task_mode",
              linked_ids: { $ifNull: ["$linked_ids", []] }
            }
          }
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
