"use client";

import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetchPerformanceById } from "../../../service/templateAction";
import PerformanceDetail from "./performanceDetail";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { Typography } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";

interface PerformanceEntry {
  performance_id: string;
  percentage?: number;
  start_date?: string;
  end_date?: string;
  added_by?: string;
  comment?: string;
  notes?: string[];
}

const Page = () => {
  const { id } = useParams();
  const performanceId = String(id);
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);

  const { data, error, mutate } = useSWR<PerformanceEntry | { error: string }>(
    id ? `kpi-performance-${id}` : null,
    () => fetchPerformanceById(performanceId)
  );

  if (!data && !error) return <Typography>{transkpi("loading")}</Typography>;
  if (error || (data && "error" in data))
    return <Typography color="error">{transkpi("errorLoadingPerformance")}</Typography>;

  // Type guard ensures data is PerformanceEntry
  if (!data || "error" in data)
    return <Typography color="error">{transkpi("errorLoadingPerformance")}</Typography>;

  return (
    <>
      <ModuleHeader name={transkpi("performance")} />
      <PerformanceDetail
        performance={data}
        performanceId={performanceId}
        transkpi={transkpi}
        mutate={mutate}
        onBack={() => history.back()}
      />
    </>
  );
};

export default Page;
