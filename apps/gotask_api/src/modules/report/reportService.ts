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

  const userMatch: Record<string, any> = {
    time_spent: { $elemMatch: { date: dateMatch } }
  };

  if (userIds && userIds.length > 0) {
    userMatch.user_id = { $in: userIds };
  }

  pipeline.push({ $match: userMatch });

  pipeline.push({
    $lookup: {
      from: "users", // name of your users collection
      localField: "user_id", // field in Task
      foreignField: "id", // field in User
      as: "user"
    }
  });

  pipeline.push({ $unwind: "$user" });

  pipeline.push({
    $addFields: {
      user_name: "$user.name"
    }
  });

  // Now continue as before
  pipeline.push({ $unwind: "$time_spent" });

  pipeline.push({
    $match: {
      "time_spent.date": dateMatch
    }
  });

  if (selectedProjects && selectedProjects.length > 0) {
    pipeline.push({
      $match: {
        project_id: { $in: selectedProjects }
      }
    });
  }

  // PROJECT stage to include the task status
  const projectStage: Record<string, any> = {
    user_id: 1,
    user_name: 1,
    "time_spent.date": 1,
    "time_spent.time_logged": 1,
    status: 1
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
    date: "$time_spent.date",
    status: "$status"
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
    status: "$_id.status",
    task_id: "$_id.task_id",
    task_title: "$_id.task_title",
    project_id: "$_id.project_id",
    project_name: "$_id.project_name",
    total_time_logged: 1
  };

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
