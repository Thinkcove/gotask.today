"use client";
import React, { Suspense } from "react";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import TaskList from "../component/taskList/taskList";

const Page = () => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);

  return (
    <>
      <ModuleHeader name={transtask("taskname")} />
      <Suspense fallback={null}>
        <TaskList initialView="users" />
      </Suspense>
    </>
  );
};

export default Page;
