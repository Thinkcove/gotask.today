"use client";

import React, { useState } from "react";
import AccessHeading from "../components/AccessHeading";
import SearchBar from "../../../component/searchBar/searchBar";
import AccessCards from "../components/AccessCards";
import { fetchAllAccessRoles } from "../services/accessService";
import { Box, Paper, Button as MuiButton, useTheme } from "@mui/material";
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
  const theme = useTheme();

  console.log("AccessContainer accessRoles:", accessRoles); // Debug log
  console.log("AccessContainer isLoading:", isLoading); // Debug log
  console.log("AccessContainer error:", error); // Debug log

  const filteredData = accessRoles.filter((item) =>
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("AccessContainer filteredData:", filteredData); // Debug log

  return (
    <Box sx={{ width: "100%", maxHeight: "100vh", overflow: "hidden", m: 0 }}>
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
          {canAccess(APPLICATIONS.ACCESS, ACTIONS.CREATE) && (
            <MuiButton
              component="a"
              href="/portal/access/pages/create"
              variant="contained"
              color="primary"
              sx={{
                marginRight: { xs: 0, md: "20px" },
                padding: "10px 20px",
                backgroundColor: theme.palette.primary.main,
                "&:hover": { backgroundColor: theme.palette.primary.dark },
              }}
            >
              Create Access
            </MuiButton>
          )}
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
    </Box>
  );
};

export default AccessContainer;