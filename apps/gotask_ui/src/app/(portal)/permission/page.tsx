"use client";

import React from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useAllProjects } from "@/app/(portal)/task/service/taskAction";
import { useParams } from "next/navigation";
import PermissionList from "./components/permissionList";

const Page = () => {


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        m: 0,
        p: 0,
        overflow: "hidden"
      }}
    >
      <ModuleHeader name={"Permission"} />

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <PermissionList />
      </Box>
    </Box>
  );
};

export default Page;
