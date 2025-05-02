"use client";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import { useTranslations } from "next-intl";
import React from "react";

const page = () => {
  const transrole = useTranslations(LOCALIZATION.TRANSITION.ROLE);
  return <ModuleHeader name={transrole("role")}/>
};

export default page;
