"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ActionButton from "@/app/component/floatingButton/actionButton";
import useSWR from "swr";
import OrganizationCards from "./organizationCards";
import { getOrganizationData } from "../services/organizationAction";
import CreateOrganization from "./createOrganization";

const OrganizationList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, mutate } = useSWR("getOrganizations", getOrganizationData);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)"
      }}
    >
      <CreateOrganization
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mutate={mutate}
      />

      <OrganizationCards organizations={data} />

      {/* Add Task Button */}
      <ActionButton
        label="Create New Organization"
        icon={<AddIcon sx={{ color: "white" }} />}
        onClick={() => setIsModalOpen(true)}
      />
    </Box>
  );
};

export default OrganizationList;
