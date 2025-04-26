"use client";
import React from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ActionButton from "@/app/component/floatingButton/actionButton";
import useSWR from "swr";
import OrganizationCards from "./organizationCards";
import { getOrganizationData } from "../services/organizationAction";

const OrganizationList = () => {
  const { data } = useSWR("getOrganizations", getOrganizationData);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)"
      }}
    >
      <OrganizationCards organizations={data} />

      {/* Add Task Button */}
      <ActionButton
        label="Create New Organization"
        icon={<AddIcon sx={{ color: "white" }} />}
        onClick={() => {}}
      />
    </Box>
  );
};

export default OrganizationList;
