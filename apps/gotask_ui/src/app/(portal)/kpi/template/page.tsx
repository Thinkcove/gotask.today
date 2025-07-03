import React from "react";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import TemplateList from "./templateList";

const Page = () => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  return (
    <>
      <ModuleHeader name={transkpi("viewname")} />
      <TemplateList />
    </>
  );
};

export default Page;
