import React from "react";
import TimeLogReport from "./components/timeLogReport";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const Page = () => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);
  return (
    <>
      <ModuleHeader name={transreport("moduleheader")} />
      <TimeLogReport />
    </>
  );
};

export default Page;
