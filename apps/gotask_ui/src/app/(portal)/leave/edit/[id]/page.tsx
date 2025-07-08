"use client";
import React from "react";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import EditLeave from "./editLeaves";

const Page = () => {
  const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);
  return (
    <>
      <ModuleHeader name={transleave("editleave")} />
      <EditLeave />
    </>
  );
};

export default Page;
