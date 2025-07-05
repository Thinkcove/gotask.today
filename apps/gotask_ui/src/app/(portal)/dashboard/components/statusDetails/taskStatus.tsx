// import React from "react";
// import useSWR from "swr";
// import { TaskStatuses } from "@/app/common/constants/task";
// import StatusChart from "@/app/component/statusChart/statusChart";
// import { LOCALIZATION } from "@/app/common/constants/localization";
// import { useTranslations } from "next-intl";

// const TaskStatus: React.FC = () => {
//   const transdashboard = useTranslations(LOCALIZATION.TRANSITION.DASHBOARD);
//   const { data } = useSWR("fetch-task-status-counts", fetchTaskStatusCounts, {
//     revalidateOnFocus: false
//   });

//   return (
//     <StatusChart
//       title={transdashboard("task")}
//       statuses={TaskStatuses}
//       statusCounts={data?.data || {}}
//       chartTitle={transdashboard("totals")}
//     />
//   );
// };

// export default TaskStatus;
