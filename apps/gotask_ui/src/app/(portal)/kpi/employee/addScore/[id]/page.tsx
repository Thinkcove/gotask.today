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

function isKpiAssignment(data: any): data is KpiAssignment {
  return data && typeof data === "object" && "assignment_id" in data;
}

const Page = () => {
  const { id } = useParams();
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const assignmentId = String(id);

  const { data, mutate } = useSWR(assignmentId ? `assignment-${assignmentId}` : null, () =>
    fetchKpiAssignmentById(assignmentId)
  );

  if (!data) return <div>{transkpi("loading")}</div>;
  if (!isKpiAssignment(data)) return <div>{transkpi("errorLoadingAssignment")}</div>;

  return (
    <>
      <ModuleHeader name={transkpi("addperformance")} />
      <UpdateScorePage assignment={data} mutate={mutate} transkpi={transkpi} />
    </>
  );
};

export default Page;
