"use client";
import React from "react";
import TaskList from "./component/taskList/taskList";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const page = () => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  return (
    <>
      <ModuleHeader name={transtask("taskname")} />
      <TaskList />
    </>
  );
};

export default page;
