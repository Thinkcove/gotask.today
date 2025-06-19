"use client";
import React from "react";
import CreateUser from "../createUser/createUser";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import ModuleHeader from "@/app/component/header/moduleHeader";

const CreateUserPage: React.FC = () => {
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);

  return (
    <>
      <ModuleHeader name={transuser("createusernew")} />
      <CreateUser />
    </>
  );
};

export default CreateUserPage;
