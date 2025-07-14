"use client";

import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { fetchKpiAssignmentById } from "../../../service/templateAction";
import UpdateScorePage from "./updateScore";
import { KpiAssignment } from "../../../service/templateInterface";

type KpiAssignmentApiResponse = KpiAssignment | { error: string };

const Page = () => {
  const { id } = useParams();
  const assignmentId = String(id);
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);

  const { data: assignment, mutate } = useSWR<KpiAssignmentApiResponse>(
    assignmentId ? `assignment-${assignmentId}` : null,
    () => fetchKpiAssignmentById(assignmentId)
  );

  if (!assignment) {
    return <div>{transkpi("loading")}</div>;
  }

  if ("error" in assignment) {
    return <div>{transkpi("errorLoadingAssignment")}</div>;
  }

  return (
    <>
      <ModuleHeader name={transkpi("addperformance")} />
      <UpdateScorePage assignment={assignment} mutate={mutate} transkpi={transkpi} />
    </>
  );
};

export default Page;
