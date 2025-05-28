"use client";
import React, { useState } from "react";
import SearchBar from "../../../component/searchBar/searchBar";
import AccessCards from "../components/AccessCards";
import { useAllAccessRoles } from "../services/accessService";
import { Box, Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/authCheck";

export interface AccessData {
  id: string;
  name: string;
  accesses: { access: string; actions: string[] }[];
  createdAt?: string;
}

const AccessContainer: React.FC = () => {
  const { canAccess } = useUserPermission();
  const [searchTerm, setSearchTerm] = useState("");
  const { accessRoles, isLoading, error } = useAllAccessRoles();

  // Sort the accessRoles array by createdAt in descending order
  const sortedData = [...accessRoles].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0; // If createdAt is missing, maintain the original order
  });

  const filteredData = sortedData.filter((item) =>
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)"
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box maxWidth={400}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            sx={{ width: "100%" }}
            placeholder="Search Access"
          />
        </Box>
      </Box>

      <AccessCards data={filteredData} loading={isLoading} error={error} />

      {canAccess(APPLICATIONS.ACCESS, ACTIONS.CREATE) && (
        <Tooltip title="Create Access">
          <Fab
            color="primary"
            href="/access/pages/create"
            sx={{
              position: "fixed",
              bottom: 35,
              right: 35,
              zIndex: 1000
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}
    </Box>
  );
};

export default AccessContainer;
