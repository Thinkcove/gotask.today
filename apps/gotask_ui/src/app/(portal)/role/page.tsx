"use client";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import React from "react";
import RoleList from "./components/roleList";

const Page = () => {
  const transrole = useTranslations(LOCALIZATION.TRANSITION.ROLE);
  return (
    <>
      <ModuleHeader name={transrole("role")} />
      <RoleList />
    </>
  );
};

export default Page;
