"use client";

import React, { Suspense } from "react";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import TaskList from "../component/taskList/taskList";
import Chat from "../../chatbot/components/chat";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import { useUserPermission } from "@/app/common/utils/userPermission";

const TaskProjectsClientPage = () => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const { canAccess } = useUserPermission();

  return (
    <>
      <ModuleHeader name={transtask("taskname")} />
      <Suspense fallback={null}>
        <TaskList initialView="projects" />
        {canAccess(APPLICATIONS.CHATBOT, ACTIONS.CREATE) && <Chat />}
      </Suspense>
    </>
  );
};

export default TaskProjectsClientPage;
