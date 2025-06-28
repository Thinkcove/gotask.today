"use client";
import React from "react";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import ModuleHeader from "@/app/component/header/moduleHeader";
import CreateProject from "./createProject";

const CreateProjectPage: React.FC = () => {
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  return (
    <>
      <ModuleHeader name={transproject("createprojectnew")} />
      <CreateProject />
    </>
  );
};

export default CreateProjectPage;
