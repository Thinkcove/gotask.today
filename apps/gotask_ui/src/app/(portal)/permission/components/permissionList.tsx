import React, { useState, useMemo } from "react";
import { Box, Grid, Paper, IconButton, Tooltip, CircularProgress, Typography } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import useSWR from "swr";
import { fetchAllgetpermission, deletePermission } from "../services/permissionAction";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { PermissionData } from "../interface/interface";
import { useUser } from "@/app/userContext";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import Table, { Column } from "@/app/component/table/table";
import { formatDate, formatTime } from "@/app/common/utils/dateTimeUtils";
import PermissionFilter from "./permissionFilter";
import CommonDialog from "@/app/component/dialog/commonDialog";

const PermissionList = () => {
  const transpermishion = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);
  const router = useRouter();
  const { user } = useUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedPermission, setSelectedPermission] = useState<PermissionData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { data, isLoading, mutate } = useSWR("getpermission", fetchAllgetpermission);

  const displayData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const onSearchChange = (val: string) => {
    setSearchTerm(val);
  };

  const onDateChange = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
  };

  const handleCreatePermission = () => {
    if (user && user?.id) {
      router.push(`/permission/create`);
    }
  };

  const handleViewClick = (permission: PermissionData) => {
    console.log("getpermissionbyid", permission.id);

    router.push(`/permission/view/${permission.id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
  };

  const handleDeleteClick = (permission: PermissionData) => {
    setSelectedPermission(permission);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPermission) return;
    setIsDeleting(true);
    await deletePermission(selectedPermission.id);
    setIsDeleteDialogOpen(false);
    setSelectedPermission(null);
    mutate();
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedPermission(null);
  };

  const isDateInRange = (dateString: string, fromDate: string, toDate: string) => {
    if (!fromDate && !toDate) return true;

    const targetDate = new Date(dateString);
    const fromDateObj = fromDate ? new Date(fromDate) : null;
    const toDateObj = toDate ? new Date(toDate) : null;

    targetDate.setHours(0, 0, 0, 0);
    if (fromDateObj) fromDateObj.setHours(0, 0, 0, 0);
    if (toDateObj) toDateObj.setHours(23, 59, 59, 999);

    if (fromDateObj && toDateObj) {
      return targetDate >= fromDateObj && targetDate <= toDateObj;
    } else if (fromDateObj) {
      return targetDate >= fromDateObj;
    } else if (toDateObj) {
      return targetDate <= toDateObj;
    }

    return true;
  };

  const filteredPermissions = useMemo(() => {
    if (!displayData || !Array.isArray(displayData)) return [];

    return displayData.filter((perm: PermissionData) => {
      const matchesSearch = perm.user_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDateRange = isDateInRange(perm.date, dateFrom, dateTo);

      return matchesSearch && matchesDateRange;
    });
  }, [displayData, searchTerm, dateFrom, dateTo]);

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
          <Tooltip title={transpermishion("deletepermission")}>
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(row)}
              sx={{ color: "#741B92" }}
              disabled={isDeleting}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  // Check if filters are active - ensure it returns boolean
  const hasActiveFilters = Boolean(searchTerm || dateFrom || dateTo);

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
      {/* Filter Component */}
      <PermissionFilter
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onBack={handleBack}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateChange={onDateChange}
        onClearFilters={handleClearFilters}
        showClear={hasActiveFilters}
        clearText={transpermishion("clearall")}
      />

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

      <CommonDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onSubmit={handleDeleteConfirm}
        title={transpermishion("deletetitle")}
        submitLabel={transpermishion("delete")}
        cancelLabel={transpermishion("cancel")}
        submitColor="#b71c1c"
      >
        <Typography sx={{ pt: 2 }}>{transpermishion("deleteconfirm")}</Typography>
      </CommonDialog>
    </>
  );
};

export default PermissionList;
