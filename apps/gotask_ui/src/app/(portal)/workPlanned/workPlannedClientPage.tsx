"use client";

import React from "react";
import WorkPlannedReport from "./components/workPlannedReport";
import ModuleHeader from "@/app/component/header/moduleHeader";

const WorkPlannedClientPage = () => {
  return (
    <>
      <ModuleHeader name="Work Planned" />
      <WorkPlannedReport />
    </>
  );
};

export default WorkPlannedClientPage;
