import React, { useState, useMemo } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import useSWR from "swr";
import { fetchAllgetpermission, deletePermission } from "../services/permissionAction";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter, useSearchParams } from "next/navigation";
import { PermissionData } from "../interface/interface";
import { useUser } from "@/app/userContext";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import Table from "@/app/component/table/table";
import { isDateInRange } from "@/app/common/utils/dateTimeUtils";
import PermissionFilter from "./permissionFilter";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { getPermissionColumns } from "./permissionColums";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { User } from "../../user/interfaces/userInterface";
import { useAllUsers } from "../../task/service/taskAction";

const PermissionList = () => {
  const searchParams = useSearchParams();
  const transpermission = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);
  const { getAllUsers: allUsers } = useAllUsers();

  const [userFilter, setUserFilter] = useState<string[]>(searchParams.getAll("user_name"));

  const router = useRouter();
  const { user } = useUser();

  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedPermission, setSelectedPermission] = useState<PermissionData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const showSnackbar = (message: string, severity: string) => {
    setSnackbar({
      open: true,
      message,
      severity: severity as SNACKBAR_SEVERITY
    });
  };
  const { data, mutate } = useSWR("getpermission", fetchAllgetpermission);

  const displayData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

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
    router.push(`/permission/view/${permission.id}`);
  };

  const handleClearFilters = () => {
    setUserFilter([]);
    setDateFrom("");
    setDateTo("");
  };

  const handleDeleteClick = (permission: PermissionData) => {
    setSelectedPermission(permission);
    setIsDeleteDialogOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const handleDeleteConfirm = async () => {
    if (!selectedPermission) return;

    setIsDeleting(true);
    try {
      await deletePermission(selectedPermission.id);
      setIsDeleteDialogOpen(false);
      setSelectedPermission(null);
      mutate();
      showSnackbar(transpermission("deletesuccess"), SNACKBAR_SEVERITY.SUCCESS);
    } catch {
      showSnackbar(transpermission("deletefailed"), SNACKBAR_SEVERITY.ERROR);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedPermission(null);
  };

  const filteredPermissions = useMemo(() => {
    if (!displayData || !Array.isArray(displayData)) return [];

    return displayData.filter((perm: PermissionData) => {
      const matchesUser =
        userFilter.length === 0 ||
        userFilter.some((name) => perm.user_name.toLowerCase().includes(name.toLowerCase()));

      const matchesDateRange = isDateInRange(perm.date, dateFrom, dateTo);

      return matchesUser && matchesDateRange;
    });
  }, [displayData, userFilter, dateFrom, dateTo]);

  // Use the common column configuration
  const permissionColumns = useMemo(
    () =>
      getPermissionColumns({
        onViewClick: handleViewClick,
        onDeleteClick: handleDeleteClick,
        isDeleting,
        translations: {
          username: transpermission("username"),
          date: transpermission("date"),
          starttime: transpermission("starttime"),
          endtime: transpermission("endtime"),
          actions: transpermission("actions"),
          viewdetails: transpermission("viewdetails"),
          deletepermission: transpermission("deletepermission")
        }
      }),
    [isDeleting, transpermission]
  );

  const hasActiveFilters = userFilter.length > 0 || !!dateFrom || !!dateTo;

  return (
    <>
      {/* Filter Component */}
      <Box sx={{ pt: 2, pl: 2 }}>
        <PermissionFilter
          userFilter={userFilter}
          allUsers={allUsers.map((u: User) => u.name)}
          onUserChange={setUserFilter}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateChange={onDateChange}
          onClearFilters={handleClearFilters}
          showClear={hasActiveFilters}
          clearText={transpermission("clearall")}
        />
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
          label={transpermission("createpermission")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={handleCreatePermission}
        />
      </Box>

      <CommonDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onSubmit={handleDeleteConfirm}
        title={transpermission("deletetitle")}
        submitLabel={transpermission("delete")}
        cancelLabel={transpermission("cancel")}
        submitColor="#b71c1c"
      >
        <Typography sx={{ pt: 2 }}>{transpermission("deleteconfirm")}</Typography>
      </CommonDialog>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </>
  );
};

export default PermissionList;
