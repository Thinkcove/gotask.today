import React from "react";
import ProjectList from "./components/projectList";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const page = () => {
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  return (
    <>
      <ModuleHeader name={transproject("viewname")} />
      <ProjectList />
    </>
  );
};

export default page;
