"use client";

import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import React from "react";
import AccessContainer from "./components/AccessContainer";
import ModuleHeader from "@/app/component/header/moduleHeader";

const AccessClientPage = () => {
  const transaccess = useTranslations(LOCALIZATION.TRANSITION.ACCESS);

  return (
    <>
      <ModuleHeader name={transaccess("access")} />
      <AccessContainer />
    </>
  );
};

export default AccessClientPage;
