import { Task } from "../../domain/model/task/task";
import { PipelineStage } from "mongoose"; // Optional, but helps with types

const getUserTimeReportService = async (
  fromDate: string,
  toDate: string,
  userIds: string[],
  showTasks: boolean,
  showProjects: boolean
) => {
  const dateMatch = { $gte: fromDate, $lte: toDate };

  const pipeline: PipelineStage[] = [];

  pipeline.push({
    $match: {
      user_id: { $in: userIds },
      time_spent: { $elemMatch: { date: dateMatch } }
    }
  });

  pipeline.push({ $unwind: "$time_spent" });

  pipeline.push({
    $match: {
      "time_spent.date": dateMatch
    }
  });

  const projectStage: Record<string, any> = {
    user_id: 1,
    user_name: 1,
    "time_spent.date": 1,
    "time_spent.time_logged": 1
  };

  if (showTasks) {
    projectStage.task_id = "$id";
    projectStage.task_title = "$title";
  }

  if (showProjects) {
    projectStage.project_id = 1;
    projectStage.project_name = 1;
  }

  pipeline.push({ $project: projectStage });

  const groupId: Record<string, any> = {
    user_id: "$user_id",
    user_name: "$user_name",
    date: "$time_spent.date"
  };

  if (showTasks) {
    groupId.task_id = "$task_id";
    groupId.task_title = "$task_title";
  }

  if (showProjects) {
    groupId.project_id = "$project_id";
    groupId.project_name = "$project_name";
  }

  pipeline.push({
    $group: {
      _id: groupId,
      total_time_logged: { $push: "$time_spent.time_logged" }
    }
  });

  pipeline.push({
    $project: {
      _id: 0,
      user_id: "$_id.user_id",
      user_name: "$_id.user_name",
      date: "$_id.date",
      task_id: "$_id.task_id",
      task_title: "$_id.task_title",
      project_id: "$_id.project_id",
      project_name: "$_id.project_name",
      total_time_logged: 1
    }
  });

  pipeline.push({ $sort: { user_name: 1, date: 1 } });

  const results = await Task.aggregate(pipeline);

  return {
    success: true,
    data: results
  };
};

export { getUserTimeReportService };
