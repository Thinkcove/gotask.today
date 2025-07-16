"use client";
import React from "react";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import ModuleHeader from "@/app/component/header/moduleHeader";
import dynamic from "next/dynamic";

const CreateProject = dynamic(() => import("./createProject"), {
  ssr: false
});

const CreateProjectPage: React.FC = () => {
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  return (
    <>
      <ModuleHeader name={transproject("createnew")} />
      <CreateProject />
    </>
  );
};

export default CreateProjectPage;
