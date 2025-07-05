"use client";

import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { fetchKpiAssignmentById } from "../../../service/templateAction";
import AssignedTemplateDetail from "./assignedTemplateDetail";
import ModuleHeader from "@/app/component/header/moduleHeader";

const AssignmentDetailPage = () => {
  const { id } = useParams();
  const assignmentId = String(id);
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);

  const { data: assignment, mutate } = useSWR(
    assignmentId ? `assignment-${assignmentId}` : null,
    () => fetchKpiAssignmentById(assignmentId)
  );

  if (!assignment) return <div>{transkpi("loading")}</div>;

  if ("error" in assignment) {
    return <div>{transkpi("errorLoadingAssignment")}</div>;
  }

  return (
    <>
      <ModuleHeader name={transkpi("assignedtemplateview")} />
      <AssignedTemplateDetail
        assignment={assignment}
        assignmentId={assignmentId}
        userId={assignment.user_id}
        mutate={mutate}
      />
    </>
  );
};

export default AssignmentDetailPage;
