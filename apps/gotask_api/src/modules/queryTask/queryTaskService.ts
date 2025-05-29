npmrimport moment from "moment";
import mongoose from "mongoose";
import { QueryTaskMessages } from "../../constants/apiMessages/queryTaskMessages";
import { TimeUtil } from "../../constants/utils/timeUtils";
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
import { IProject } from "../../domain/model/project/project";
import { ITask } from "../../domain/model/task/task";
import { ITaskComment } from "../../domain/model/task/taskComment";
import { ITimeSpentEntry } from "../../domain/model/task/timespent";
import { User } from "../../domain/model/user/user";

// Parse time_added string (e.g., "1d2h" -> 26 hours, "3h" -> 3 hours, "2d" -> 48 hours)
function parseTimeLogged(timeLogged: string | undefined): number {
  if (!timeLogged) return 0;
  try {
    const match = timeLogged.match(/^(\d+)d(\d+)h$|^(\d+)d$|^(\d+)h$/i);
    if (!match) return 0;
    if (match[1] && match[2]) {
      // "XdYh" format, e.g., "1d2h"
      const days = parseInt(match[1], 10);
      const hours = parseInt(match[2], 10);
      return days * 24 + hours;
    } else if (match[3]) {
      // "Xd" format, e.g., "2d"
      const days = parseInt(match[3], 10);
      return days * 24;
    } else if (match[4]) {
      // "Yh" format, e.g., "3h"
      const hours = parseInt(match[4], 10);
      return hours;
    }
    return 0;
  } catch (error) {
    console.error(`Error parsing time_added "${timeLogged}": ${(error as Error).message}`);
    return 0;
  }
}

export const createNewTaskService = async (
  taskData: Partial<ITask>
): Promise<{ success: boolean; data?: ITask; message?: string }> => {
  try {
    const requiredFields = ["user_id", "project_id", "created_on", "due_date"];
    if (!requiredFields.every((field) => taskData[field as keyof ITask])) {
      return { success: false, message: QueryTaskMessages.CREATE.REQUIRED };
    }

    const newTask = await createNewTask(taskData);
    return { success: true, data: newTask, message: `Task created successfully` };
  } catch (error: any) {
    return { success: false, message: error.message || QueryTaskMessages.CREATE.FAILED };
  }
};

export const deleteTaskService = async (
  id: string
): Promise<{ success: boolean; data?: ITask; message?: string }> => {
  try {
    const deletedTask = await deleteByTaskId(id);
    if (!deletedTask) {
      return { success: false, message: `No task found with id: ${id}` };
    }
    return { success: true, data: deletedTask, message: `Task ${id} deleted successfully` };
  } catch (error: any) {
    return { success: false, message: error.message || QueryTaskMessages.DELETE.FAILED };
  }
};

export const getAllTasksService = async (): Promise<{
  success: boolean;
  data?: ITask[];
  message?: string;
}> => {
  try {
    const tasks = await findAllTasks();
    return { success: true, data: tasks, message: `Retrieved ${tasks.length} tasks` };
  } catch (error: any) {
    return { success: false, message: error.message || QueryTaskMessages.QUERY.FAILED };
  }
};

export const getTaskByIdService = async (
  id: string
): Promise<{ success: boolean; data?: ITask; message?: string }> => {
  try {
    const task = await findTaskById(id);
    if (!task) {
      return { success: false, message: `No task found with id: ${id}` };
    }
    return { success: true, data: task, message: `Task ${id} retrieved successfully` };
  } catch (error: any) {
    return { success: false, message: error.message || QueryTaskMessages.QUERY.FAILED };
  }
};

export const getTasksByProjectService = async (
  pipeline: any[]
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const tasks = await findTasksByProject(pipeline);
    return { success: true, data: tasks, message: `Retrieved tasks for project` };
  } catch (error: any) {
    return { success: false, message: error.message || QueryTaskMessages.QUERY.FAILED };
  }
};

export const getTasksByUserService = async (
  pipeline: any[]
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const tasks = await findTasksByUser(pipeline);
    return { success: true, data: tasks, message: `Retrieved tasks for user` };
  } catch (error: any) {
    return { success: false, message: error.message || QueryTaskMessages.QUERY.FAILED };
  }
};

export const getTaskCountByStatusService = async (): Promise<{
  success: boolean;
  data?: Record<string, number>;
  message?: string;
}> => {
  try {
    const counts = await findTaskCountByStatus();
    return { success: true, data: counts, message: `Task counts by status retrieved` };
  } catch (error: any) {
    return { success: false, message: error.message || QueryTaskMessages.QUERY.FAILED };
  }
};

export const updateTaskService = async (
  id: string,
  updateData: Partial<ITask>
): Promise<{ success: boolean; data?: ITask; message?: string }> => {
  try {
    const updatedTask = await updateATask(id, updateData);
    if (!updatedTask) {
      return { success: false, message: `No task found with id: ${id}` };
    }
    return { success: true, data: updatedTask, message: `Task ${id} updated successfully` };
  } catch (error: any) {
    return { success: false, message: error.message || QueryTaskMessages.UPDATE.FAILED };
  }
};

export const createCommentService = async (
  commentData: ITaskComment
): Promise<{ success: boolean; data?: ITaskComment; message?: string }> => {
  try {
    const newComment = await createCommentInTask(commentData);
    return {
      success: true,
      data: newComment,
      message: `Comment added to task ${commentData.task_id}`
    };
  } catch (error: any) {
    return { success: false, message: error.message || QueryTaskMessages.COMMENT.FAILED };
  }
};

export const updateCommentService = async (
  id: string,
  newCommentText: Partial<ITaskComment>
): Promise<{ success: boolean; data?: ITaskComment; message?: string }> => {
  try {
    const updatedComment = await updateCommentInTask(id, newCommentText);
    if (!updatedComment) {
      return { success: false, message: `No comment found with id: ${id}` };
    }
    return { success: true, data: updatedComment, message: `Comment ${id} updated successfully` };
  } catch (error: any) {
    return { success: false, message: error.message || QueryTaskMessages.COMMENT.FAILED };
  }
};

export const addTimeSpentService = async (
  id: string,
  timeEntries: ITimeSpentEntry[]
): Promise<{ success: boolean; data?: ITask; message?: string }> => {
  try {
    const updatedTask = await addTimeSpentToTask(id, timeEntries);
    if (!updatedTask) {
      return { success: false, message: `No task found with id: ${id}` };
    }
    return { success: true, data: updatedTask, message: `Time spent added to task ${id}` };
  } catch (error: any) {
    return { success: false, message: error.message || QueryTaskMessages.TIME.FAILED };
  }
};

export const processTaskQuery = async (
  query: string,
  parsedQuery: Record<string, any>
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const lowerQuery = query.toLowerCase();

    // Fallback for "List out overdue task in a project GoTask"
    if (
      lowerQuery.includes("overdue") &&
      lowerQuery.includes("project") &&
      lowerQuery.includes("gotask")
    ) {
      const project = await mongoose
        .model<IProject>("Project")
        .findOne({
          name: { $regex: "^GoTask$", $options: "i" }
        })
        .lean();
      if (!project) {
        return { success: false, message: "No project found with name: GoTask" };
      }
      const overdueTasks = await mongoose
        .model<ITask>("Task")
        .find({
          project_id: project.id,
          due_date: { $lt: new Date() },
          status: { $ne: "completed" }
        })
        .lean();
      if (!overdueTasks.length) {
        return { success: true, message: `No overdue tasks in project GoTask` };
      }
      const taskList = overdueTasks
        .map(
          (task) =>
            `- ${task.title} (Status: ${task.status}, Due: ${moment(task.due_date).format("YYYY-MM-DD")})`
        )
        .join("\n");
      return { success: true, message: `Overdue tasks in project GoTask:\n${taskList}` };
    }

    // Fallback for "Does the GoTask is finished"
    if (
      lowerQuery.includes("gotask") &&
      (lowerQuery.includes("finished") || lowerQuery.includes("is finished"))
    ) {
      const project = await mongoose
        .model<IProject>("Project")
        .findOne({
          name: { $regex: "^GoTask$", $options: "i" }
        })
        .lean();
      if (!project) {
        return { success: false, message: "No project found with name: GoTask" };
      }
      const isFinished = project.status.toLowerCase() === "completed";
      return {
        success: true,
        message: `Project GoTask is ${isFinished ? "finished" : "not finished"}`
      };
    }

    // Fallback for "List out overdue task of Rizwana?"
    if (lowerQuery.includes("overdue") && lowerQuery.includes("rizwana")) {
      const user = await User.findOne({
        name: { $regex: "^Rizwana$", $options: "i" }
      }).lean();
      if (!user) {
        return { success: false, message: "No employee found with name: Rizwana" };
      }
      const overdueTasks = await mongoose
        .model<ITask>("Task")
        .find({
          user_id: user.id,
          due_date: { $lt: new Date() },
          status: { $ne: "completed" }
        })
        .lean();
      if (!overdueTasks.length) {
        return { success: true, message: `No overdue tasks assigned to Rizwana` };
      }
      const taskList = overdueTasks
        .map(
          (task) =>
            `- ${task.title} (Status: ${task.status}, Due: ${moment(task.due_date).format("YYYY-MM-DD")})`
        )
        .join("\n");
      return { success: true, message: `Overdue tasks assigned to Rizwana:\n${taskList}` };
    }

    if (parsedQuery.taskName && !parsedQuery.empname && !parsedQuery.project_name) {
      const tasks = await findAllTasks();
      const task = tasks.find((t) =>
        t.title.toLowerCase().includes(parsedQuery.taskName!.toLowerCase())
      );
      if (!task) {
        return { success: false, message: `No tasks found with name: ${parsedQuery.taskName}` };
      }

      if (parsedQuery.taskStatus) {
        return { success: true, message: `Task ${task.title} status: ${task.status}` };
      }

      if (parsedQuery.dueDate) {
        const dueDate = task.due_date ? moment(task.due_date).format("DD MMMM YYYY") : "N/A";
        return { success: true, message: `Task ${task.title} due date: ${dueDate}` };
      }

      if (parsedQuery.hoursSpent) {
        const timeStr = task.time_spent_total || "0d0h";
        const daysMatch = timeStr.match(/(\d+)d/);
        const hoursMatch = timeStr.match(/(\d+)h/);
        const days = daysMatch ? parseInt(daysMatch[1]) : 0;
        const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
        const totalHours = days * 24 + hours;
        const formatted = TimeUtil.formatHoursToTimeString(totalHours);
        return { success: true, message: `Task ${task.title} total time spent: ${formatted}` };
      }

      if (parsedQuery.isFinished) {
        const isFinished = task.status === "completed";
        return {
          success: true,
          message: `Task ${task.title} is ${isFinished ? "finished" : "not finished"}`
        };
      }

      if (parsedQuery.assignedEmployees) {
        const user = await User.findOne({ id: task.user_id }).lean();
        const name = user ? user.name : "Unknown";
        return { success: true, message: `Task ${task.title} assigned to: ${name}` };
      }

      if (parsedQuery.taskSeverity) {
        return {
          success: true,
          message: `Task ${task.title} severity: ${task.severity || "N/A"}`
        };
      }

      if (parsedQuery.workAfterDue) {
        if (!task.due_date || !task.time_spent) {
          return { success: true, message: `No time spent after due date for task ${task.title}` };
        }
        const hoursAfterDue = task.time_spent
          .filter((entry) => moment(entry.date).isAfter(moment(task.due_date)))
          .reduce((sum, entry) => sum + parseTimeLogged(entry.time_logged), 0);
        const formatted = TimeUtil.formatHoursToTimeString(hoursAfterDue);
        return {
          success: true,
          message: `Spent ${formatted} after due date on task ${task.title}`
        };
      }

      return {
        success: true,
        message: `Task ${task.title}: Status=${task.status}, Time Spent=${task.time_spent_total}, Due=${moment(task.due_date).format("DD MMMM YYYY")}`
      };
    }

    if (parsedQuery.project_name || parsedQuery.project_id) {
      const projectQuery: any = {};
      if (parsedQuery.project_name) {
        projectQuery.name = { $regex: parsedQuery.project_name, $options: "i" };
      }
      if (parsedQuery.project_id) {
        projectQuery.id = parsedQuery.project_id;
      }

      const project = await mongoose.model<IProject>("Project").findOne(projectQuery).lean();
      if (!project) {
        return {
          success: false,
          message: `No project found with ${parsedQuery.project_name ? `name: ${parsedQuery.project_name}` : `id: ${parsedQuery.project_id}`}`
        };
      }

      const pipeline = [{ $match: { project_id: project.id } }];
      const tasks = await findTasksByProject(pipeline);

      if (parsedQuery.overdueWork) {
        let userIdForOverdue: string | undefined;
        if (parsedQuery.empname) {
          const user = await User.findOne({
            name: { $regex: `^${parsedQuery.empname}$`, $options: "i" }
          }).lean();
          if (!user) {
            return { success: false, message: `Employee ${parsedQuery.empname} not found` };
          }
          userIdForOverdue = user.id;
        }
        const overdueTasks = await mongoose
          .model<ITask>("Task")
          .find({
            project_id: project.id,
            due_date: { $lt: new Date() },
            status: { $ne: "completed" },
            ...(userIdForOverdue && { user_id: userIdForOverdue })
          })
          .lean();
        if (!overdueTasks.length) {
          return {
            success: true,
            message: `No overdue tasks in project ${project.name}${parsedQuery.empname ? ` for ${parsedQuery.empname}` : ""}`
          };
        }
        const taskList = overdueTasks
          .map(
            (task) =>
              `- ${task.title} (Status: ${task.status}, Due: ${moment(task.due_date).format("YYYY-MM-DD")})`
          )
          .join("\n");
        return {
          success: true,
          message: `Overdue tasks in project ${project.name}${parsedQuery.empname ? ` for ${parsedQuery.empname}` : ""}:\n${taskList}`
        };
      }

      if (parsedQuery.isFinished) {
        const isFinished = project.status.toLowerCase() === "completed";
        return {
          success: true,
          message: `Project ${project.name} is ${isFinished ? "finished" : "not finished"}`
        };
      }

      if (parsedQuery.openTasks) {
        const openTasks = tasks.filter((t: ITask) => t.status !== "completed");
        if (!openTasks.length) {
          return { success: true, message: `No open tasks for project ${project.name}` };
        }
        const taskNames = openTasks.map((t: ITask) => t.title).join(", ");
        return { success: true, message: `Open tasks for ${project.name}: ${taskNames}` };
      }

      if (parsedQuery.completedTasks) {
        const completedTasks = tasks.filter((t: ITask) => t.status === "completed");
        if (!completedTasks.length) {
          return { success: true, message: `No completed tasks for project ${project.name}` };
        }
        const taskNames = completedTasks.map((t: ITask) => t.title).join(", ");
        return { success: true, message: `Completed tasks for ${project.name}: ${taskNames}` };
      }

      if (parsedQuery.assignedEmployees) {
        const userIds = [...new Set(tasks.map((t: ITask) => t.user_id))];
        const users = await User.find({ id: { $in: userIds } }).lean();
        const names = users.map((u) => u.name).join(", ");
        return { success: true, message: `Employees assigned to ${project.name}: ${names}` };
      }

      if (parsedQuery.hoursSpent) {
        const totalHours = tasks.reduce((sum: number, t: ITask) => {
          const hours = TimeUtil.parseHourMinuteString(t.time_spent_total);
          return sum + hours;
        }, 0);
        const formatted = TimeUtil.formatHoursToTimeString(totalHours);
        return { success: true, message: `Total hours spent on ${project.name}: ${formatted}` };
      }

      if (parsedQuery.projectAssignedHours) {
        const assignedHours = (project as any).assigned_hours || 0;
        return {
          success: true,
          message: `Project ${project.name} has ${assignedHours} hours assigned`
        };
      }

      if (parsedQuery.dueDate) {
        const dueDate = project.due_date ? moment(project.due_date).format("DD MMMM YYYY") : "N/A";
        return { success: true, message: `Due date for project ${project.name}: ${dueDate}` };
      }

      if (parsedQuery.projectStatus) {
        return { success: true, message: `Status of project ${project.name}: ${project.status}` };
      }

      return { success: true, message: `Found ${tasks.length} tasks for ${project.name}` };
    }

    if (parsedQuery.empname || parsedQuery.empcode) {
      let user_id = parsedQuery.empcode;
      let empname = parsedQuery.empname;

      if (parsedQuery.empname) {
        const user = await User.findOne({
          name: { $regex: `^${parsedQuery.empname}$`, $options: "i" }
        }).lean();
        if (!user) {
          return { success: false, message: `No employee found with name: ${parsedQuery.empname}` };
        }
        user_id = user.id;
        empname = user.name;
      } else if (parsedQuery.empcode) {
        const user = await User.findOne({ id: parsedQuery.empcode }).lean();
        if (!user) {
          return { success: false, message: `No employee with empcode: ${parsedQuery.empcode}` };
        }
        empname = user.name;
        user_id = user.id;
      }

      const pipeline = [{ $match: { user_id } }];
      const tasks = await findTasksByUser(pipeline);

      if (!tasks.length) {
        return { success: false, message: `No tasks assigned to ${empname}` };
      }

      if (parsedQuery.overdueWork && !parsedQuery.project_name) {
        const overdueTasks = await mongoose
          .model<ITask>("Task")
          .find({
            user_id,
            due_date: { $lt: new Date() },
            status: { $ne: "completed" }
          })
          .lean();
        if (!overdueTasks.length) {
          return { success: true, message: `No overdue tasks assigned to ${empname}` };
        }
        const taskList = overdueTasks
          .map(
            (task) =>
              `- ${task.title} (Status: ${task.status}, Due: ${moment(task.due_date).format("YYYY-MM-DD")})`
          )
          .join("\n");
        return { success: true, message: `Overdue tasks assigned to ${empname}:\n${taskList}` };
      }

      if (parsedQuery.openTasks) {
        const openTasks = tasks.filter((t: ITask) => t.status !== "completed");
        if (!openTasks.length) {
          return { success: true, message: `No open tasks for ${empname}` };
        }
        const taskNames = openTasks.map((t: ITask) => t.title).join(", ");
        return { success: true, message: `Open tasks for ${empname}: ${taskNames}` };
      }

      if (parsedQuery.completedTasks) {
        const completedTasks = tasks.filter((t: ITask) => t.status === "completed");
        if (!completedTasks.length) {
          return { success: true, message: `No completed tasks for ${empname}` };
        }
        const taskNames = completedTasks.map((t: ITask) => t.title).join(", ");
        return { success: true, message: `Completed tasks for ${empname}: ${taskNames}` };
      }

      if (parsedQuery.hoursSpent && !parsedQuery.date && parsedQuery.taskName) {
        const task = tasks.find((t: any) =>
          t.title.toLowerCase().includes(parsedQuery.taskName!.toLowerCase())
        );
        if (!task) {
          return {
            success: false,
            message: `Task ${parsedQuery.taskName} not found for ${empname}`
          };
        }
        const timeStr = task.time_spent_total || "0d0h";
        const daysMatch = timeStr.match(/(\d+)d/);
        const hoursMatch = timeStr.match(/(\d+)h/);
        const days = daysMatch ? parseInt(daysMatch[1]) : 0;
        const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
        const totalHours = days * 24 + hours;
        const formatted = TimeUtil.formatHoursToTimeString(totalHours);
        return { success: true, message: `${empname} spent ${formatted} on task ${task.title}` };
      }

      if (parsedQuery.date && parsedQuery.hoursSpent) {
        const targetDate = moment(parsedQuery.date, "YYYY-MM-DD").format("YYYY-MM-DD");
        const totalHours = tasks.reduce((sum: number, t: ITask) => {
          const entry = t.time_spent.find(
            (e: ITimeSpentEntry) => moment(e.date).format("YYYY-MM-DD") === targetDate
          );
          return sum + (entry ? parseTimeLogged(entry.time_logged) : 0);
        }, 0);
        const formatted = TimeUtil.formatHoursToTimeString(totalHours);
        return {
          success: true,
          message: `${empname} spent ${formatted} on tasks on ${targetDate}`
        };
      }

      if (parsedQuery.workAfterDue && parsedQuery.taskName) {
        const task = tasks.find((t: any) =>
          t.title.toLowerCase().includes(parsedQuery.taskName!.toLowerCase())
        );
        if (!task) {
          return {
            success: false,
            message: `Task ${parsedQuery.taskName} not found for ${empname}`
          };
        }
        if (!task.due_date || !task.time_spent) {
          return { success: true, message: `No time spent after due date for task ${task.title}` };
        }
        const hoursAfterDue = task.time_spent
          .filter((entry: any) => moment(entry.date).isAfter(moment(task.due_date)))
          .reduce(
            (sum: number, entry: ITimeSpentEntry) => sum + parseTimeLogged(entry.time_logged),
            0
          );
        const formatted = TimeUtil.formatHoursToTimeString(hoursAfterDue);
        return {
          success: true,
          message: `${empname} spent ${formatted} after due date on task ${task.title}`
        };
      }

      if (parsedQuery.taskDetails) {
        const response = `Tasks for ${empname}:\n${tasks
          .map(
            (t: ITask) =>
              `${t.title}: Status=${t.status}, Time Spent=${t.time_spent_total || "0d0h"}, Due=${moment(t.due_date).format("DD MMMM YYYY")}`
          )
          .join("\n")}`;
        return { success: true, message: response.trim() };
      }

      let response = `Tasks for ${empname}:\n`;
      tasks.forEach((task: ITask) => {
        response += `${task.title}: Status=${task.status}, Time Spent=${task.time_spent_total}, Due=${moment(task.due_date).format("DD MMMM YYYY")}\n`;
      });
      return { success: true, message: response.trim() };
    }

    return {
      success: false,
      message: "Invalid task query: Please specify task, project, or employee details"
    };
  } catch (error: any) {
    return { success: false, message: error.message || QueryTaskMessages.QUERY.FAILED };
  }
};

export default {
  createNewTaskService,
  deleteTaskService,
  getAllTasksService,
  getTaskByIdService,
  getTasksByProjectService,
  getTasksByUserService,
  getTaskCountByStatusService,
  updateTaskService,
  createCommentService,
  updateCommentService,
  addTimeSpentService,
  processTaskQuery
};
