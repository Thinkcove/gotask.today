import { PipelineStage } from "mongoose";
import { Task } from "../../domain/model/task/task";

const getUserTimeReportService = async (
  fromDate: string,
  toDate: string,
  userIds: string[],
  showTasks: boolean,
  selectedProjects?: string[]
) => {
  const dateMatch = { $gte: fromDate, $lte: toDate };

  const pipeline: PipelineStage[] = [];

  // Filter by user and date
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

  // Apply project filter if provided
  if (selectedProjects && selectedProjects.length > 0) {
    pipeline.push({
      $match: {
        project_id: { $in: selectedProjects }
      }
    });
  }

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

  if (selectedProjects && selectedProjects.length > 0) {
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

  if (selectedProjects && selectedProjects.length > 0) {
    groupId.project_id = "$project_id";
    groupId.project_name = "$project_name";
  }

  pipeline.push({
    $group: {
      _id: groupId,
      total_time_logged: { $push: "$time_spent.time_logged" }
    }
  });

  const finalProject: Record<string, any> = {
    _id: 0,
    user_id: "$_id.user_id",
    user_name: "$_id.user_name",
    date: "$_id.date",
    task_id: "$_id.task_id",
    task_title: "$_id.task_title",
    project_id: "$_id.project_id",
    project_name: "$_id.project_name",
    total_time_logged: 1
  };

  // Clean up output if task/project info was not included
  if (!showTasks) {
    delete finalProject.task_id;
    delete finalProject.task_title;
  }

  if (!(selectedProjects && selectedProjects.length > 0)) {
    delete finalProject.project_id;
    delete finalProject.project_name;
  }

  pipeline.push({ $project: finalProject });

  pipeline.push({ $sort: { user_name: 1, date: 1 } });

  const results = await Task.aggregate(pipeline);

  return {
    success: true,
    data: results
  };
};

export { getUserTimeReportService };
