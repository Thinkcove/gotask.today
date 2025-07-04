"use client";
import React from "react";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import AssigneeList from "./assigneeList";

const Page = () => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  return (
    <>
      <ModuleHeader name={transkpi("viewname")} />
      <AssigneeList />
    </>
  );
};

export default Page;
