"use client";

import React from "react";
import OrganizationList from "./components/organizationList";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const OrganizationClientPage = () => {
  const transorganization = useTranslations(LOCALIZATION.TRANSITION.ORGANIZATION);

  return (
    <>
      <ModuleHeader name={transorganization("viewname")} />
      <OrganizationList />
    </>
  );
};

export default OrganizationClientPage;
