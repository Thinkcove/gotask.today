import React from "react";
import OrganizationList from "./components/organizationList";
import ModuleHeader from "@/app/component/appBar/moduleHeader";

const page = () => {
  return (
    <>
      <ModuleHeader name="Organization" />
      <OrganizationList />
    </>
  );
};

export default page;
