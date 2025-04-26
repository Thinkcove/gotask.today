import React from "react";
import useSWR from "swr";
import { TaskStatuses } from "@/app/common/constants/task";
import { fetchTaskStatusCounts } from "@/app/portal/task/service/taskAction";
import StatusChart from "@/app/component/statusChart/statusChart";

const TaskStatus: React.FC = () => {
  const { data } = useSWR("fetch-task-status-counts", fetchTaskStatusCounts, {
    revalidateOnFocus: false
  });

  return (
    <StatusChart
      title="Task Distribution"
      statuses={TaskStatuses}
      statusCounts={data?.data || {}}
      chartTitle="Total Tasks"
    />
  );
};

export default TaskStatus;
