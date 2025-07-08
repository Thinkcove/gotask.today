"use client";
import React from "react";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import LeaveDetail from "./leaveDetail";

const Page = () => {
  const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);
  return (
    <>
      <ModuleHeader name={transleave("leavedetail")} />
      <LeaveDetail />
    </>
  );
};

export default Page;
