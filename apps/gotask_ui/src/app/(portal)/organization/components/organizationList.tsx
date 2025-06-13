"use client";
import React, { useState, useMemo } from "react";
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
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";
import SearchBar from "@/app/component/searchBar/searchBar";
import { Organization } from "../interfaces/organizatioinInterface";

const OrganizationList = () => {
  const { canAccess } = useUserPermission();
  const transorganization = useTranslations(LOCALIZATION.TRANSITION.ORGANIZATION);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: organizations, mutate } = useSWR("getOrganizations", getOrganizationData);

  const filteredOrganizations = useMemo(() => {
    return (
      organizations?.filter((org: Organization) =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    );
  }, [organizations, searchTerm]);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)",
        p: 3
      }}
    >
      {/* Modal for Create Organization */}
      <CreateOrganization
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mutate={mutate}
      />

      {/* Search Bar */}
      <Box mb={3} maxWidth={400}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          sx={{ width: "100%" }}
          placeholder={transorganization("searchplaceholder")}
        />
      </Box>

      {/* Cards List */}
      <OrganizationCards organizations={filteredOrganizations} />

      {/* Floating Add Button with Permission Check */}
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

