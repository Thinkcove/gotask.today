import TaskMessages from "../../constants/apiMessages/taskMessage";
import { TimeUtil } from "../../constants/utils.ts/timeUtils";
import {
  addTimeSpentToTask,
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
import { ITask } from "../../domain/model/task/task";
import { ITaskComment } from "../../domain/model/task/taskComment";
import { ITimeSpentEntry } from "../../domain/model/task/timespent";

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
  search_vars?: string[][],
  min_date?: string,
  max_date?: string,
  date_var?: string,
  more_variation?: string,
  less_variation?: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const skip = (page - 1) * pageSize;
    const taskSkip = (taskPage - 1) * taskPageSize;

    const isValidSearch = (arr: any[][] | undefined): arr is any[][] =>
      Array.isArray(arr) && arr.length > 0 && Array.isArray(arr[0]) && arr[0].length > 0;

    const orConditions: any[] = [];

    //  Text Search
    if (isValidSearch(search_vars) && isValidSearch(search_vals)) {
      for (let i = 0; i < search_vars.length; i++) {
        const field = search_vars[i][0];
        const value = search_vals[i][0];
        const fieldName = field === "id" ? "project_id" : field;
        orConditions.push({ [fieldName]: { $regex: new RegExp(value, "i") } });
      }
    }

    //  Date Range (converted to OR logic)
    if (date_var && min_date && max_date) {
      orConditions.push({
        [date_var]: {
          $gte: new Date(min_date),
          $lte: new Date(max_date)
        }
      });
    }

    // Main filter
    const matchFilter: any = orConditions.length > 0 ? { $or: orConditions } : {};

    const aggregationPipeline: any[] = [
      { $match: matchFilter },
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
          tasks: {
            $slice: [{ $sortArray: { input: "$tasks", sortBy: { updatedAt: -1 } } }, 0, 1000]
          }
        }
      }
    ];

    let taskGroups = await findTasksByProject(aggregationPipeline);

    const matchesLessVariation = (variation: string, target: string) => {
      return TimeUtil.parseTimeString(variation) <= TimeUtil.parseTimeString(target);
    };

    const matchesMoreVariation = (variation: string, target: string) => {
      return TimeUtil.parseTimeString(variation) >= TimeUtil.parseTimeString(target);
    };

    if (less_variation || more_variation) {
      const filterByVariation = (task: any) => {
        const variation = task.variation;
        if (!variation) return false;
        if (less_variation && matchesLessVariation(variation, less_variation)) return true;
        if (more_variation && matchesMoreVariation(variation, more_variation)) return true;
        return false;
      };

      //  Merge OR logic (add variation-matching tasks)
      taskGroups = taskGroups
        .map((group: any) => {
          const allTasks = group.tasks;
          const matchedTasks = allTasks.filter(filterByVariation);
          const mergedTasks = [
            ...new Map([...group.tasks, ...matchedTasks].map((t) => [t.id, t])).values()
          ]; // remove duplicates

          return {
            ...group,
            tasks: mergedTasks,
            total_count: mergedTasks.length,
            task_total_pages: Math.ceil(mergedTasks.length / taskPageSize)
          };
        })
        .filter((g: any) => g.tasks.length > 0);
    }

    //  Paginate final results
    const totalProjects = taskGroups.length;
    const paginatedProjects = taskGroups.slice(skip, skip + pageSize);
    const finalProjects = paginatedProjects.map((project: any) => {
      const slicedTasks = project.tasks.slice(taskSkip, taskSkip + taskPageSize);
      return {
        ...project,
        tasks: slicedTasks,
        task_total_pages: Math.ceil(project.total_count / taskPageSize)
      };
    });

    return {
      success: true,
      data: {
        taskbyprojects: finalProjects,
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
  search_vars?: string[][],
  min_date?: string,
  max_date?: string,
  date_var?: string,
  more_variation?: string,
  less_variation?: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const skip = (page - 1) * pageSize;
    const taskSkip = (taskPage - 1) * taskPageSize;

    const isValidSearch = (arr: any[][] | undefined): arr is any[][] =>
      Array.isArray(arr) && arr.length > 0 && Array.isArray(arr[0]) && arr[0].length > 0;

    const orConditions: any[] = [];

    //  Text Search
    if (isValidSearch(search_vars) && isValidSearch(search_vals)) {
      for (let i = 0; i < search_vars.length; i++) {
        const field = search_vars[i][0];
        const value = search_vals[i][0];
        const fieldName = field === "id" ? "project_id" : field;
        orConditions.push({ [fieldName]: { $regex: new RegExp(value, "i") } });
      }
    }

    //  Date Range (converted to OR logic)
    if (date_var && min_date && max_date) {
      orConditions.push({
        [date_var]: {
          $gte: new Date(min_date),
          $lte: new Date(max_date)
        }
      });
    }

    // Main filter
    const matchFilter: any = orConditions.length > 0 ? { $or: orConditions } : {};

    const aggregationPipeline: any[] = [
      { $match: matchFilter },
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
          tasks: {
            $slice: [
              { $sortArray: { input: "$tasks", sortBy: { updatedAt: -1 } } },
              0,
              1000 // Temporarily get all tasks for manual filtering
            ]
          }
        }
      }
    ];

    let taskGroups = await findTasksByUser(aggregationPipeline);

    const matchesLessVariation = (variation: string, target: string) => {
      return TimeUtil.parseTimeString(variation) <= TimeUtil.parseTimeString(target);
    };

    const matchesMoreVariation = (variation: string, target: string) => {
      return TimeUtil.parseTimeString(variation) >= TimeUtil.parseTimeString(target);
    };

    if (less_variation || more_variation) {
      const filterByVariation = (task: any) => {
        const variation = task.variation;
        if (!variation) return false;
        if (less_variation && matchesLessVariation(variation, less_variation)) return true;
        if (more_variation && matchesMoreVariation(variation, more_variation)) return true;
        return false;
      };

      //  Merge OR logic (add variation-matching tasks)
      taskGroups = taskGroups
        .map((group: any) => {
          const allTasks = group.tasks;
          const matchedTasks = allTasks.filter(filterByVariation);
          const mergedTasks = [
            ...new Map([...group.tasks, ...matchedTasks].map((t) => [t.id, t])).values()
          ]; // remove duplicates

          return {
            ...group,
            tasks: mergedTasks,
            total_count: mergedTasks.length,
            task_total_pages: Math.ceil(mergedTasks.length / taskPageSize)
          };
        })
        .filter((g: any) => g.tasks.length > 0);
    }

    // Paginate final results
    const totalUsers = taskGroups.length;
    const paginatedUsers = taskGroups.slice(skip, skip + pageSize);
    const finalUsers = paginatedUsers.map((project: any) => {
      const slicedTasks = project.tasks.slice(taskSkip, taskSkip + taskPageSize);
      return {
        ...project,
        tasks: slicedTasks,
        task_total_pages: Math.ceil(project.total_count / taskPageSize)
      };
    });

    return {
      success: true,
      data: {
        taskbyusers: finalUsers,
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

//add time spent
const addTimeSpent = async (
  id: string,
  timeEntries: ITimeSpentEntry | ITimeSpentEntry[]
): Promise<{ success: boolean; data?: Partial<ITask>; message?: string }> => {
  console.log("timeEntries in service", timeEntries);

  try {
    const entriesArray = Array.isArray(timeEntries) ? timeEntries : [timeEntries];

    const updatedTask = await addTimeSpentToTask(id, entriesArray); // <-- Pass only array

    if (!updatedTask) {
      return { success: false, message: TaskMessages.TIME_SPENT.NOT_FOUND };
    }

    return {
      success: true,
      data: {
        time_spent: updatedTask.time_spent,
        estimated_time: updatedTask.estimated_time,
        remaining_time: updatedTask.remaining_time,
        time_spent_total: updatedTask.time_spent_total
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
  addTimeSpent
};
