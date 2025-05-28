"use client";
import React from "react";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import TaskList from "../component/taskList/taskList";

const Page = () => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);

  return (
    <>
      <ModuleHeader name={transtask("taskname")} />
      <TaskList initialView="projects" />
    </>
  );
};

export default Page;
