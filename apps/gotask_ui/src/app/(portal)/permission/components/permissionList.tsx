import React, { useState, useMemo } from "react";
import { Box, Grid, Paper, IconButton, Tooltip, CircularProgress } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import useSWR from "swr";
import { fetchAllgetpermission } from "../services/permissionAction";
import SearchBar from "@/app/component/searchBar/searchBar";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { PermissionData } from "../interface/interface";
import { useUser } from "@/app/userContext";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import Table, { Column } from "@/app/component/table/table";

const PermissionList = () => {
  const transpermishion = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);
  const router = useRouter();
  const { user } = useUser();

  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useSWR("getpermission", fetchAllgetpermission, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  });

  const displayData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const onSearchChange = (val: string) => {
    setSearchTerm(val);
  };

  const handleCreatePermission = () => {
    //permission
    if (user && user?.id) {
      router.push(`/permission/createPermission`);
    }
  };

  const handleViewClick = (permission: PermissionData) => {
    router.push(`/permission/view/${permission.id}`);
  };

  const filteredPermissions = useMemo(() => {
    if (!displayData || !Array.isArray(displayData)) return [];
    return displayData.filter((perm: PermissionData) =>
      perm.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [displayData, searchTerm]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const permissionColumns: Column<PermissionData>[] = [
    { id: "user_name", label: transpermishion("username"), sortable: true },
    {
      id: "date",
      label: transpermishion("date"),
      render: (value: string | number | string[] | undefined, row: PermissionData) =>
        formatDate(row.date),
      sortable: true
    },
    {
      id: "start_time",
      label: transpermishion("starttime"),
      render: (value: string | number | string[] | undefined, row: PermissionData) =>
        formatTime(row.start_time || ""),
      sortable: true
    },
    {
      id: "end_time",
      label: transpermishion("endtime"),
      render: (value: string | number | string[] | undefined, row: PermissionData) =>
        formatTime(row.end_time || ""),
      sortable: true
    },
    {
      id: "actions",
      label: transpermishion("actions"),
      sortable: false,
      render: (value: string | number | string[] | undefined, row: PermissionData) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={transpermishion("viewdetails")}>
            <IconButton size="small" onClick={() => handleViewClick(row)} sx={{ color: "#741B92" }}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: 1,
          px: 2,
          mt: 2,
          flexWrap: "nowrap"
        }}
      >
        <Box sx={{ flex: "1 1 auto", maxWidth: "300px" }}>
          <SearchBar
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={transpermishion("search") || "Search Permission"}
          />
        </Box>
      </Box>

      <Box
        sx={{ width: "100%", display: "flex", flexDirection: "column", overflowY: "auto", mt: 2 }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto"
              }}
            >
              <Box sx={{ width: "100%", flex: 1 }}>
                <Box sx={{ minWidth: 800 }}>
                  <Table<PermissionData> columns={permissionColumns} rows={filteredPermissions} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1300 }}>
        <ActionButton
          label={transpermishion("createpermission")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={handleCreatePermission}
        />
      </Box>
    </>
  );
};

export default PermissionList;
