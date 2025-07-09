// page.tsx
import React from "react";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ApplyLeave from "./applyLeaves";

const Page = () => {
  const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);
  return (
    <>
      <ModuleHeader name={transleave("leave")} />
      <ApplyLeave />
    </>
  );
};

export default Page;
