"use client";
import React from "react";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import GoalsList from "./components/goalsList";

const Page = () => {
  const transgoal = useTranslations(LOCALIZATION.TRANSITION.WEEKLY_GOAL);
  return (
    <>
      <ModuleHeader name={transgoal("goal")} />
      <GoalsList />
    </>
  );
};

export default Page;
