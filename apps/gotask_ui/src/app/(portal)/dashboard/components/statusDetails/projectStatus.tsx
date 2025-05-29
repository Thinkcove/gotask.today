import React from "react";
import useSWR from "swr";
import { ProjectStatuses } from "@/app/common/constants/project";
import { fetchProjectStatusCounts } from "@/app/(portal)/project/services/projectAction";
import StatusChart from "@/app/component/statusChart/statusChart";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const ProjectStatus: React.FC = () => {
  const transdashboard = useTranslations(LOCALIZATION.TRANSITION.DASHBOARD);
  const { data } = useSWR("fetch-project-status-counts", fetchProjectStatusCounts, {
    revalidateOnFocus: false
  });

  return (
    <StatusChart
      title={transdashboard("project")}
      statuses={ProjectStatuses}
      statusCounts={data?.data || {}}
      chartTitle={transdashboard("total")}
    />
  );
};

export default ProjectStatus;
