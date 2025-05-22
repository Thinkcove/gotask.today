import React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { TaskStatuses } from "@/app/common/constants/task";
import { fetchTaskStatusCounts } from "@/app/portal/task/service/taskAction";
import StatusChart from "@/app/component/statusChart/statusChart";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const TaskStatus: React.FC = () => {
  const router = useRouter();
  const transdashboard = useTranslations(LOCALIZATION.TRANSITION.DASHBOARD);

  const { data } = useSWR("fetch-task-status-counts", fetchTaskStatusCounts, {
    revalidateOnFocus: false
  });

  // Navigate to task list with status filter properly applied
  const handleStatusClick = (statusKey: string) => {
    // Use query parameters to pass the status filter
    router.push(`/portal/task?status=${statusKey}`);
  };  

  return (
    <StatusChart
      title={transdashboard("task")}
      statuses={TaskStatuses}
      statusCounts={data?.data || {}}
      chartTitle={transdashboard("totals")}
      onStatusClick={handleStatusClick}
    />
  );
};

export default TaskStatus;
