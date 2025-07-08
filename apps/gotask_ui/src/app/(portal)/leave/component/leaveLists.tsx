"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Box, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import Table from "@/app/component/table/table";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoAssetsImage from "@assets/placeholderImages/notask.svg";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { LeaveEntry, LeaveFilters as LeaveFiltersType } from "../interface/leaveInterface";
import { useDeleteLeave, useGetLeavesWithFilters } from "../services/leaveAction";
import LeaveFilters from "./leaveFilters";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { getLeaveColumns } from "./leaveColumns";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";

const LeaveList: React.FC = () => {
  const router = useRouter();
  const [userIdFilter, setUserIdFilter] = useState<string[]>([]);
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string[]>([]);
  const [fromDateFilter, setFromDateFilter] = useState<string>("");
  const [toDateFilter, setToDateFilter] = useState<string>("");
  const [selectedLeave, setSelectedLeave] = useState<LeaveEntry | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);

  // Define filter payload for the API
  const filterPayload: LeaveFiltersType = useMemo(
    () => ({
      user_id: userIdFilter.length > 0 ? userIdFilter.join(",") : undefined,
      leave_type: leaveTypeFilter.length > 0 ? leaveTypeFilter.join(",") : undefined,
      from_date: fromDateFilter || undefined,
      to_date: toDateFilter || undefined,
      page: 1,
      page_size: 10,
      sort_field: "from_date",
      sort_order: "ASC"
    }),
    [userIdFilter, leaveTypeFilter, fromDateFilter, toDateFilter]
  );

  // Fetch filtered leaves using the API
  const { data: filteredLeaves, isLoading, isError } = useGetLeavesWithFilters(filterPayload, true);

  // Extract unique user IDs, usernames, and leave types for filter dropdowns
  const leaveTypes = useMemo(() => {
    if (!filteredLeaves || !Array.isArray(filteredLeaves)) return [];
    return Array.from(new Set(filteredLeaves.map((leave: LeaveEntry) => leave.leave_type)));
  }, [filteredLeaves]);

  const userIds = useMemo(() => {
    if (!filteredLeaves || !Array.isArray(filteredLeaves)) return [];
    return Array.from(new Set(filteredLeaves.map((leave: LeaveEntry) => leave.user_id)));
  }, [filteredLeaves]);

  const userNames = useMemo(() => {
    if (!filteredLeaves || !Array.isArray(filteredLeaves)) return [];
    return Array.from(new Set(filteredLeaves.map((leave: LeaveEntry) => leave.user_name)));
  }, [filteredLeaves]);

  // Handlers for table actions
  const handleViewClick = useCallback(
    (leave: LeaveEntry) => {
      router.push(`/leave/view/${leave.id}`);
    },
    [router]
  );

  const handleEditClick = useCallback(
    (leave: LeaveEntry) => {
      router.push(`/leave/edit/${leave.id}`);
    },
    [router]
  );

  const handleDeleteClick = useCallback((leave: LeaveEntry) => {
    setSelectedLeave(leave);
    setIsDeleteDialogOpen(true);
  }, []);

  const { mutate: deleteLeave } = useDeleteLeave();

  const handleDeleteConfirm = async () => {
    if (!selectedLeave) return;
    try {
      await deleteLeave(selectedLeave.id);
      setIsDeleteDialogOpen(false);
      setSelectedLeave(null);
      setSnackbar({
        open: true,
        message: transleave("deletesuccess"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
    } catch {
      setSnackbar({
        open: true,
        message: transleave("faileddelete"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedLeave(null);
  };

  const handleActionClick = () => {
    router.push("/leave/applyleave");
  };

  const leaveColumns = useMemo(
    () =>
      getLeaveColumns({
        transleave,
        onViewClick: handleViewClick,
        onEditClick: handleEditClick,
        onDeleteClick: handleDeleteClick
      }),
    [transleave, handleViewClick, handleEditClick, handleDeleteClick]
  );

  const handleClearFilters = () => {
    setUserIdFilter([]);
    setLeaveTypeFilter([]);
    setFromDateFilter("");
    setToDateFilter("");
  };

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
      <Box marginTop={"15px"}>
        <LeaveFilters
          userIdFilter={userIdFilter}
          leaveTypeFilter={leaveTypeFilter}
          fromDate={fromDateFilter}
          toDate={toDateFilter}
          allUserIds={userIds}
          allUserNames={userNames}
          allLeaveTypes={leaveTypes}
          onUserIdChange={setUserIdFilter}
          onLeaveTypeChange={setLeaveTypeFilter}
          onFromDateChange={setFromDateFilter}
          onToDateChange={setToDateFilter}
          onClearFilters={handleClearFilters}
        />
      </Box>

      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            {isError ? (
              <EmptyState
                imageSrc={NoAssetsImage}
                message={transleave("failedfetch") || "Failed to fetch leaves"}
              />
            ) : !filteredLeaves || filteredLeaves.length === 0 ? (
              <EmptyState imageSrc={NoAssetsImage} message={transleave("noleave")} />
            ) : (
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
                    <Table<LeaveEntry> columns={leaveColumns} rows={filteredLeaves} />
                  </Box>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1300 }}>
        <ActionButton
          label={transleave("createleave")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={handleActionClick}
        />
      </Box>

      <CommonDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onSubmit={handleDeleteConfirm}
        title={transleave("deletetitle")}
        submitLabel={transleave("delete")}
        cancelLabel={transleave("cancel")}
        submitColor="#b71c1c"
      >
        <Typography sx={{ pt: 2 }}>{transleave("deleteconfirm")}</Typography>
      </CommonDialog>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default LeaveList;
