"use client";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import React from "react";
import RoleList from "./components/roleList";

const page = () => {
  return (
    <>
      <ModuleHeader name="Role" />
      <RoleList />
    </>
  );
};

export default page;
