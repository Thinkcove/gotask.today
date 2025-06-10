import React from "react";
import AccessEditForm from "../../../components/accessEditForm";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const AccessEditPage = () => {
  const transAccess = useTranslations(LOCALIZATION.TRANSITION.ACCESS);

  return (
    <>
      <ModuleHeader name={transAccess("editaccess")} />
      <AccessEditForm />
    </>
  );
};

export default AccessEditPage;
