"use client";
import React from "react";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import LeaveList from "./component/leavelist";

const LeavePage: React.FC = () => {
  const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);
  return (
    <>
      <ModuleHeader name={transleave("leave")} />
      <LeaveList />
    </>
  );
};

export default LeavePage;
