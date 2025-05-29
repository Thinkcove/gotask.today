import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import React from "react";
import AccessContainer from "../access/components/AccessContainer";
import ModuleHeader from "../../component/appBar/moduleHeader"; 

const Page = () => {
  const transaccess = useTranslations(LOCALIZATION.TRANSITION.ACCESS);

  return (
    <>
      <ModuleHeader name={transaccess("access")} />
      <AccessContainer />
    </>
  );
};

export default Page;
