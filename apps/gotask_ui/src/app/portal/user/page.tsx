"use client";
import React from "react";
import UserList from "./components/userList";
import ModuleHeader from "@/app/component/appBar/moduleHeader";

const page = () => {
  return (
    <>
      <ModuleHeader name="User" />
      <UserList />
    </>
  );
};

export default page;
