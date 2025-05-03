"use client";
import React, { useEffect, useState } from "react";
import AccessHeading from "../components/AccessHeading";
import SearchBar from "../../../component/searchBar/searchBar";
import AccessCardList from "./AccessCardList";
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

  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", maxHeight: "100vh", overflow: "hidden", m: 0 }}>
      <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Heading */}
        <AccessHeading />

        {/* Search and Button */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 2,
          }}
        >
          {/* Search Bar aligned to the left with fixed width */}
          <Box sx={{ width: '30%' }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              sx={{
                width: '100%',
              }}
            />
          </Box>

          {/* "Create Access" Button aligned to the right */}
          <MuiButton
            component="a"
            href="/portal/access/pages/create"
            variant="contained"
            color="primary"
            sx={{
              marginRight: '20px',
              padding: '10px 20px',
              backgroundColor: theme.palette.primary.main,
              '&:hover': { backgroundColor: theme.palette.primary.dark },
            }}
          >
            Create Access
          </MuiButton>
        </Box>

        {/* Scrollable Table */}
        <Box sx={{ 
            flex: 1, 
            overflowY: "hidden", 
            minHeight: "200px",  // Set a fixed minimum height
            maxHeight: "calc(100vh - 160px)",  // Adjust to account for header and padding
            paddingBottom: '10px'  // Ensure some space at the bottom if content is less
        }}>
          <AccessCardList data={filteredData} loading={loading} />
        </Box>
      </Paper>
    </Box>
  );
};

export default AccessContainer;
