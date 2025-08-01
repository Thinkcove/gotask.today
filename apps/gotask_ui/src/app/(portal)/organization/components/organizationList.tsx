"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ActionButton from "@/app/component/floatingButton/actionButton";
import useSWR from "swr";
import OrganizationCards from "./organizationCards";
import { getOrganizationData } from "../services/organizationAction";
import CreateOrganization from "./createOrganization";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import SearchBar from "@/app/component/searchBar/searchBar";
import { Organization } from "../interfaces/organizatioinInterface";

const OrganizationList = () => {
  const { canAccess } = useUserPermission();
  const transorganization = useTranslations(LOCALIZATION.TRANSITION.ORGANIZATION);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: organizations, mutate } = useSWR("getOrganizations", getOrganizationData);

  const filteredOrganizations =
    organizations?.filter((org: Organization) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || null;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", p: 3 }}>
      <CreateOrganization
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mutate={mutate}
      />

      <Box mb={3} maxWidth={400}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          sx={{ width: "100%" }}
          placeholder={transorganization("searchplaceholder")}
        />
      </Box>

      {/* Scrollable content */}
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          overflowY: "auto",
          maxHeight: "calc(100vh - 150px)",
          pb:2
        }}
      >
        <OrganizationCards organizations={filteredOrganizations} />
      </Box>

      {canAccess(APPLICATIONS.ORGANIZATION, ACTIONS.CREATE) && (
        <ActionButton
          label={transorganization("createnew")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={() => setIsModalOpen(true)}
        />
      )}
    </Box>
  );
};

export default OrganizationList;
