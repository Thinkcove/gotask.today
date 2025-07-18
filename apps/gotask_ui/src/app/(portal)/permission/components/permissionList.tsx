import React, { useState, useMemo } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import useSWR from "swr";
import { fetchPermissionsWithFilters, deletePermission } from "../services/permissionAction";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterPayload, PermissionData } from "../interface/interface";
import { useUser } from "@/app/userContext";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import Table from "@/app/component/table/table";
import PermissionFilter from "./permissionFilter";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { getPermissionColumns } from "./permissionColums";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { User } from "../../user/interfaces/userInterface";
import { useAllUsers } from "../../task/service/taskAction";
import { ASC, PAGE_OPTIONS } from "@/app/component/table/tableConstants";

const PermissionList = () => {
  const searchParams = useSearchParams();
  const transpermission = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);
  const { getAllUsers: allUsers } = useAllUsers();
  const [userFilter, setUserFilter] = useState<string[]>(searchParams.getAll("user_name"));
  const router = useRouter();
  const { user } = useUser();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(PAGE_OPTIONS.DEFAULT_ROWS_25);
  const [sortField, setSortField] = useState<string>("from_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(ASC);
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

  const onUserChange = (newUserFilter: string[]) => {
    setUserFilter(newUserFilter);
    setPage(0);
  };

  const userIds = useMemo(() => {
    return userFilter
      .map((name) => allUsers.find((u: User) => u.name === name)?.id)
      .filter((id): id is string => !!id);
  }, [userFilter, allUsers]);

  const filterPayload: FilterPayload = useMemo(
    () => ({
      user_id: userIds.length > 0 ? userIds : undefined,
      from_date: dateFrom || undefined,
      to_date: dateTo || undefined,
      page: page + PAGE_OPTIONS.ONE,
      page_size: pageSize,
      sort_field: sortField,
      sort_order: sortOrder
    }),
    [userIds, dateFrom, dateTo, page, pageSize, sortField, sortOrder]
  );

  const { data, mutate, isLoading } = useSWR(["permissionsWithFilters", filterPayload], () =>
    fetchPermissionsWithFilters(filterPayload)
  );

  const displayData = useMemo(() => {
    return data?.data?.permissions || data?.permissions || [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.data?.total_count || data?.total_count || PAGE_OPTIONS.ZERO;
  }, [data]);

  const onDateChange = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
    setPage(0);
  };

  const handleCreatePermission = () => {
    if (user && user?.id) {
      router.push("/permission/create");
    }
  };

  const handleViewClick = (permission: PermissionData) => {
    router.push(`/permission/view/${permission.id}`);
  };

  const handleDeleteClick = (permission: PermissionData) => {
    setSelectedPermission(permission);
    setIsDeleteDialogOpen(true);
  };

  const handleClearFilters = () => {
    setUserFilter([]);
    setDateFrom("");
    setDateTo("");
    setPage(0);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handlePageChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    setPageSize(newLimit);
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortField(key);
    setSortOrder(order);
    setPage(0); // Reset to first page when sorting changes
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

      const newTotalCount = totalCount - PAGE_OPTIONS.ONE;
      const newTotalPages = Math.ceil(newTotalCount / PAGE_OPTIONS.DEFAULT_ROWS_25);
      if (page >= newTotalPages && newTotalPages > PAGE_OPTIONS.ZERO) {
        setPage(newTotalPages - PAGE_OPTIONS.ONE);
      }
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

  const skeletonloading = isLoading && totalCount === 0;

  const filteredPermissions = useMemo(() => {
    return displayData;
  }, [displayData]);

  const permissionColumns = getPermissionColumns({
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
  });

  const hasActiveFilters = userFilter.length > 0 || !!dateFrom || !!dateTo;

  return (
    <>
      <>
        <Box sx={{ pt: 2, pl: 2 }}>
          <PermissionFilter
            userFilter={userFilter}
            allUsers={allUsers.map((u: User) => u.name)}
            onUserChange={onUserChange}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateChange={onDateChange}
            onClearFilters={handleClearFilters}
            showClear={hasActiveFilters}
            clearText={transpermission("clearall")}
            loading={skeletonloading}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            mt: 2
          }}
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
                    <Table<PermissionData>
                      columns={permissionColumns}
                      rows={filteredPermissions || []}
                      isLoading={isLoading}
                      rowsPerPageOptions={[
                        PAGE_OPTIONS.DEFAULT_ROWS_25,
                        PAGE_OPTIONS.DEFAULT_ROWS_35,
                        PAGE_OPTIONS.DEFAULT_ROWS_45
                      ]}
                      defaultRowsPerPage={PAGE_OPTIONS.DEFAULT_ROWS_25}
                      onPageChange={handlePageChange}
                      totalCount={totalCount}
                      onSortChange={handleSortChange}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </>
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
      <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1300 }}>
        <ActionButton
          label={transpermission("createpermission")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={handleCreatePermission}
        />
      </Box>
    </>
  );
};

export default PermissionList;
