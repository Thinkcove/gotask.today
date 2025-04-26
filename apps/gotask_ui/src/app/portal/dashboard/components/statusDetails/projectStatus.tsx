import React from "react";
import useSWR from "swr";
import { ProjectStatuses } from "@/app/common/constants/project";
import { fetchProjectStatusCounts } from "@/app/portal/project/services/projectAction";
import StatusChart from "@/app/component/statusChart/statusChart";

const ProjectStatus: React.FC = () => {
  const { data } = useSWR("fetch-project-status-counts", fetchProjectStatusCounts, {
    revalidateOnFocus: false
  });

  return (
    <StatusChart
      title="Project Distribution"
      statuses={ProjectStatuses}
      statusCounts={data?.data || {}}
      chartTitle="Total Projects"
    />
  );
};

export default ProjectStatus;
