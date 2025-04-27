import React from "react";
import ProjectList from "./components/projectList";
import ModuleHeader from "@/app/component/appBar/moduleHeader";

const page = () => {
  return (
    <>
      <ModuleHeader name="Project" />
      <ProjectList />
    </>
  );
};

export default page;
