"use client";

import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import RoleList from "./components/roleList";

export default function RoleClientPage() {
  const transrole = useTranslations(LOCALIZATION.TRANSITION.ROLE);

  return (
    <>
      <ModuleHeader name={transrole("role")} />
      <RoleList />
    </>
  );
}
