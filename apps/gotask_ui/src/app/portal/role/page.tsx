"use client";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import { useTranslations } from "next-intl";
import React from "react";
import RoleList from "./components/roleList";

const page = () => {
  const transrole = useTranslations(LOCALIZATION.TRANSITION.ROLE);
  return (
    <>
      <ModuleHeader name={transrole("role")} />
      <RoleList />
    </>
  );
};

export default page;
