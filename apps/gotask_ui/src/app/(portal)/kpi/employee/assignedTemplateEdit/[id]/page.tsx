"use client";

import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { fetchKpiAssignmentById } from "../../../service/templateAction";
import AssignedTemplateEdit from "./assignedTemplateEdit";

const Page = () => {
  const { id } = useParams();
  const assignmentId = String(id);
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);

  const { data, mutate } = useSWR(assignmentId ? `assignment-${assignmentId}` : null, () =>
    fetchKpiAssignmentById(assignmentId)
  );

  if (!data) {
    return <div>{transkpi("loading")}</div>;
  }

  if ("error" in data) {
    return <div>{transkpi("errorLoadingAssignment")}</div>;
  }

  return (
    <>
      <ModuleHeader name={transkpi("editassignment")} />
      <AssignedTemplateEdit assignment={data} mutate={mutate} transkpi={transkpi} />
    </>
  );
};

export default Page;
