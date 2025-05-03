"use client";
import React from "react";
import UserList from "./components/userList";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const page = () => {
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  return (
    <>
      <ModuleHeader name={transuser("user")} />
      <UserList />
    </>
  );
};

export default page;
