import { PipelineStage } from "mongoose";
import { Task } from "../../domain/model/task/task";

const getWorkPlannedService = async (
  fromDate: string,
  toDate: string,
  userIds: string[],
  selectedProjects?: string[]
) => {
  const dateMatch = { $gte: new Date(fromDate), $lte: new Date(toDate) };
  const pipeline: PipelineStage[] = [];

  // Initial match for tasks created within the date range
  const initialMatch: Record<string, any> = {
    created_on: dateMatch
  };

  // Conditionally apply userId filter
  if (userIds && userIds.length > 0) {
    initialMatch.user_id = { $in: userIds };
  }

  // Conditionally apply project filter
  if (selectedProjects && selectedProjects.length > 0) {
    initialMatch.project_id = { $in: selectedProjects };
  }

  pipeline.push({ $match: initialMatch });

  // Project stage - get required fields
  const projectStage: Record<string, any> = {
    user_id: 1,
    user_name: 1,
    start_date: 1,
    due_date: 1,
    user_estimated: 1,
    status: 1,
    task_id: "$id",
    task_title: "$title"
  };

  if (selectedProjects && selectedProjects.length > 0) {
    projectStage.project_id = 1;
    projectStage.project_name = 1;
  }

  pipeline.push({ $project: projectStage });

  // Group by user, start_date, due_date, and optional task/project
  const groupId: Record<string, any> = {
    user_id: "$user_id",
    user_name: "$user_name",
    start_date: "$start_date",
    due_date: "$due_date",
    status: "$status",
    task_id: "$task_id",
    task_title: "$task_title"
  };

  if (selectedProjects && selectedProjects.length > 0) {
    groupId.project_id = "$project_id";
    groupId.project_name = "$project_name";
  }

  pipeline.push({
    $group: {
      _id: groupId,
      user_estimated: { $first: "$user_estimated" } // Keep user_estimated for each task
    }
  });

  // Final project to format the output
  const finalProject: Record<string, any> = {
    _id: 0,
    user_id: "$_id.user_id",
    user_name: "$_id.user_name",
    start_date: "$_id.start_date",
    end_date: "$_id.due_date",
    user_estimated: 1,
    status: "$_id.status",
    task_id: "$_id.task_id",
    task_title: "$_id.task_title"
  };

  if (selectedProjects && selectedProjects.length > 0) {
    finalProject.project_id = "$_id.project_id";
    finalProject.project_name = "$_id.project_name";
  }

  pipeline.push({ $project: finalProject });
  pipeline.push({ $sort: { user_name: 1, start_date: 1 } });

  // Execute aggregation
  const results = await Task.aggregate(pipeline);

  return {
    success: true,
    data: results
  };
};

export { getWorkPlannedService };
