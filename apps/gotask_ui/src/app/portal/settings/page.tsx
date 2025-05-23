"use client";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import React from "react";
import PreferenceList from "./preference/components/preferenceList";

const Page = () => {
  return (
    <>
      <ModuleHeader name="User Preference" />
      <PreferenceList />
    </>
  );
};

export default Page;
