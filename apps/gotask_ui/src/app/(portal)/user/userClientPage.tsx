"use client";

import React from "react";
import UserList from "./components/userList";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const UserClientPage = () => {
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);

  return (
    <>
      <ModuleHeader name={transuser("user")} />
      <UserList />
    </>
  );
};

export default UserClientPage;
