import React from "react";
import TimeLogReport from "./components/timeLogReport";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
const page = () => {
  return (
    <>
      <ModuleHeader name="User Log Report" />
      <TimeLogReport />
    </>
  );
};

export default page;
