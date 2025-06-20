"use client";
import React from "react";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import ProjectGoalList from "./components/projectGoal/projectGoalList";

const Page = () => {
  const transgoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);
  return (
    <>
      <ModuleHeader name={transgoal("goal")} />
      <ProjectGoalList />
    </>
  );
};

export default Page;
