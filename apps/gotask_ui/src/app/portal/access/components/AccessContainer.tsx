'use client';

import React, { useState } from "react";
import AccessHeading from "../components/AccessHeading";
import SearchBar from "../../../component/searchBar/searchBar";
import AccessCards from "../components/AccessCards";
import { fetchAllAccessRoles } from "../services/accessService";
import {
  Box,
  Paper,
  Fab,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { userPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/authCheck";

export interface AccessData {
  id: string;
  name: string;
  accesses: { access: string; actions: string[] }[];
  createdAt?: string;
}

const AccessContainer: React.FC = () => {
  const { canAccess } = userPermission();
  const [searchTerm, setSearchTerm] = useState("");
  const { accessRoles, isLoading, error } = fetchAllAccessRoles();

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
    <Box sx={{ width: "100%", maxHeight: "100vh", overflow: "hidden", m: 0, position: "relative" }}>
      <Paper
        sx={{
          padding: 2,
          boxShadow: 3,
          borderRadius: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <AccessHeading />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: 2,
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "30%" } }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              sx={{ width: "100%" }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: "200px",
            maxHeight: "calc(100vh - 160px)",
            paddingBottom: "10px",
          }}
        >
          <AccessCards data={filteredData} loading={isLoading} error={error} />
        </Box>
      </Paper>

      {canAccess(APPLICATIONS.ACCESS, ACTIONS.CREATE) && (
        <Tooltip title="Create Access">
          <Fab
            color="primary"
            href="/portal/access/pages/create"
            sx={{
              position: "fixed",
              bottom: 35,
              right: 35,
              zIndex: 1000,
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
