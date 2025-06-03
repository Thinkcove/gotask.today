import React from "react";
import ProjectList from "./components/projectList";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const Page = () => {
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  return (
    <>
      <ModuleHeader name={transproject("viewname")} />
      <ProjectList />
    </>
  );
};

export default Page;
