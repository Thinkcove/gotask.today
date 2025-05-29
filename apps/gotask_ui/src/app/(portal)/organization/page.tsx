import React from "react";
import OrganizationList from "./components/organizationList";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const Page = () => {
  const transorganization = useTranslations(LOCALIZATION.TRANSITION.ORGANIZATION);
  return (
    <>
      <ModuleHeader name={transorganization("viewname")} />
      <OrganizationList />
    </>
  );
};

export default Page;

