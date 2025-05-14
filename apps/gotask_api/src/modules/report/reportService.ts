import { Project } from "../../domain/model/project/project";
import { Task } from "../../domain/model/task/task";
import { IUserTimeLogInput, IUserTimeLogOutput } from "./reportInterface";

const getUserTimeLogService = async (input: IUserTimeLogInput): Promise<IUserTimeLogOutput> => {
  console.log("input", input);
  const {
    from,
    to,
    users = [],
    projectIds: rawProjectIds = [],
    includeTasks = false,
    includeProject = false
  } = input;

  console.log("RAW PAYLOAD >>>", input);

  const finalProjectIds =
    Array.isArray(rawProjectIds) && rawProjectIds.length > 0 ? rawProjectIds : [];

  console.log("finalProjectIds", finalProjectIds);

  const projectFilter = finalProjectIds.length > 0 ? { id: { $in: finalProjectIds } } : {};

  console.log("projectFilter", projectFilter);

  const projects = await Project.find(projectFilter).lean();
  console.log("projects", projects);

  if (!projects.length) {
    return {
      success: true,
      data: users.map((userId) => ({
        user_id: userId,
        message: "No matching projects found"
      }))
    };
  }

  const userProjectMap = new Map<string, Set<string>>();

  for (const project of projects) {
    const usersInProject = Array.isArray(project.user_id)
      ? project.user_id
      : project.user_id
        ? [project.user_id]
        : [];

    for (const userId of users) {
      if (usersInProject.includes(userId)) {
        if (!userProjectMap.has(userId)) {
          userProjectMap.set(userId, new Set());
        }
        userProjectMap.get(userId)!.add(project.id);
      }
    }
  }

  const logs: any[] = [];

  for (const userId of users) {
    const userProjects = userProjectMap.get(userId);

    if (!userProjects || userProjects.size === 0) {
      logs.push({
        user_id: userId,
        message: "No matching project found"
      });
      continue;
    }

    const matchFilter: any = {
      user_id: userId,
      project_id: { $in: Array.from(userProjects) },
      time_spent: {
        $elemMatch: {
          date: { $gte: from, $lte: to }
        }
      }
    };

    const pipeline: any[] = [
      { $match: matchFilter },
      { $unwind: "$time_spent" },
      {
        $match: {
          "time_spent.date": { $gte: from, $lte: to }
        }
      },
      {
        $project: {
          user_id: 1,
          user_name: 1,
          project_id: 1,
          project_name: 1,
          task_id: "$id",
          task_title: "$title",
          date: "$time_spent.date",
          time_logged: "$time_spent.time_logged"
        }
      },
      {
        $group: {
          _id: {
            user_id: "$user_id",
            date: "$date",
            ...(includeTasks && { task_id: "$task_id", task_title: "$task_title" }),
            ...(includeProject && { project_id: "$project_id", project_name: "$project_name" })
          },
          time_logs: { $push: "$time_logged" }
        }
      }
    ];

    const userLogs = await Task.aggregate(pipeline);

    if (userLogs.length === 0) {
      logs.push({
        user_id: userId,
        message: "No time logs found in selected date range"
      });
    } else {
      logs.push(...userLogs);
    }
  }

  return {
    success: true,
    data: logs
  };
};

export { getUserTimeLogService };
