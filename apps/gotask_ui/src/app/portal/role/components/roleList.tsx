"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ActionButton from "@/app/component/floatingButton/actionButton";
import useSWR from "swr";
import { getRoleData } from "../services/roleAction";
import RoleCards from "./roleCards";
import CreateRole from "./createRole";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const RoleList = () => {
  const transrole = useTranslations(LOCALIZATION.TRANSITION.ROLE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, mutate } = useSWR("getRoles", getRoleData);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)"
      }}
    >
      <CreateRole open={isModalOpen} onClose={() => setIsModalOpen(false)} mutate={mutate} />

      <RoleCards roles={data} />

      {/* Add Task Button */}
      <ActionButton
        label={transrole("createrole")}
        icon={<AddIcon sx={{ color: "white" }} />}
        onClick={() => setIsModalOpen(true)}
      />
    </Box>
  );
};

export default RoleList;
