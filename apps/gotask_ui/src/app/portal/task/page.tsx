"use client";
import React from "react";
import TaskList from "./component/taskList/taskList";
import ModuleHeader from "@/app/component/appBar/moduleHeader";

const page = () => {
  return (
    <>
      <ModuleHeader name="Task" />
      <TaskList />
    </>
  );
};

export default page;
