"use client";

import React from "react";
import TimeLogReport from "./components/timeLogReport";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const ReportClientPage = () => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);

  return (
    <>
      <ModuleHeader name={transreport("moduleheader")} />
      <TimeLogReport />
    </>
  );
};

export default ReportClientPage;
