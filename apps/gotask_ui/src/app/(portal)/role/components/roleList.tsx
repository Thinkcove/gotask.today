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
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import { Role } from "../interfaces/roleInterface";
import SearchBar from "@/app/component/searchBar/searchBar";

const RoleList = () => {
  const { canAccess } = useUserPermission();
  const transrole = useTranslations(LOCALIZATION.TRANSITION.ROLE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: roles, mutate } = useSWR("getRoles", getRoleData);

  const filteredRoles =
    roles?.filter((role: Role) => role.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    null;

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        p: 3,
        pb: 2,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <CreateRole open={isModalOpen} onClose={() => setIsModalOpen(false)} mutate={mutate} />

      <Box mb={3} maxWidth={400}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          sx={{ width: "100%" }}
          placeholder={transrole("searchplaceholder")}
        />
      </Box>

      <Box
        sx={{
          position: "relative",
          height: "90vh",
          overflowY: "auto",
          maxHeight: "calc(100vh - 150px)",
          pb: 2
        }}
      >
        <RoleCards roles={filteredRoles} />
      </Box>

      {canAccess(APPLICATIONS.ROLE, ACTIONS.CREATE) && (
        <ActionButton
          label={transrole("createrole")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={() => setIsModalOpen(true)}
        />
      )}
    </Box>
  );
};

export default RoleList;
