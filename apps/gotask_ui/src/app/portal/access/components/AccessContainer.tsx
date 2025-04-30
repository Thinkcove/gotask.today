"use client";
import React, { useEffect, useState } from "react";
import AccessHeading from "../components/AccessHeading";
import SearchBar from "../../../component/searchBar/searchBar";
import Button from "../components/Button";
import AccessTable from "./AccessTable";
import { getAllAccessRoles } from "../services/accessService";
import { Box, Paper, Button as MuiButton, useTheme } from "@mui/material";

export interface AccessData {
  id: string;
  name: string;
  accesses: { access: string; actions: string[] }[];
  createdAt?: string;
}

const AccessContainer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [accessList, setAccessList] = useState<AccessData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const response = await getAllAccessRoles();
        console.log("📦 Fetched Access Data:", response);

        if (response.success && Array.isArray(response.data)) {
          const formattedData: AccessData[] = response.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            accesses: item.accesses || [],
            createdAt: item.createdAt || undefined,
          }));
          setAccessList(formattedData);
        } else {
          console.warn("⚠️ Unexpected access data structure:", response);
          setAccessList([]);
        }
      } catch (error) {
        console.error("❌ Failed to fetch access roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccess();
  }, []);

  const filteredData = accessList.filter((item) =>
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const theme = useTheme(); // Get theme object for custom MUI styles

  return (
    <Box sx={{ width: "100%", maxHeight: "100vh", overflow: "hidden", m:0 }}>
      <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Heading */}
        <AccessHeading />

        {/* Search and Button */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", gap: 4, width: "100%" }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            sx={{
              width: { xs: "250px", md: "300px" }, // Responsive width using MUI's sx
              flex: 1
            }} 
          />
        </Box>

        <Box sx={{ marginLeft: "10px" }}>
          <MuiButton
            component="a"
            href="/portal/access/pages/create"
            variant="contained"
            color="primary"
            sx={{
              padding: "10px 20px",
              backgroundColor: theme.palette.primary.main,
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          >
            Create Access
          </MuiButton>
        </Box>

        {/* Table */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <AccessTable data={filteredData} loading={loading} />
        </Box>
      </Paper>
    </Box>
  );
};

export default AccessContainer;
