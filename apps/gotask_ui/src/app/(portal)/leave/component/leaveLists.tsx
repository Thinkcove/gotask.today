"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import Table from "@/app/component/table/table";
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
import { DESC, PAGE_OPTIONS } from "@/app/component/table/tableConstants";
import { useAllUsers } from "../../task/service/taskAction";
import { LEAVE_TYPE } from "@/app/common/constants/leave";

const LeaveList: React.FC = () => {
  const router = useRouter();
  const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);
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
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(PAGE_OPTIONS.DEFAULT_ROWS_25);
  const [sortField, setSortField] = useState<string>("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(DESC);

  const { getAllUsers: allUsers } = useAllUsers();
  const leaveTypes = useMemo(() => Object.values(LEAVE_TYPE), []);

  const allUserIds = useMemo(
    () => allUsers.map((user: { id: string; name: string }) => user.id),
    [allUsers]
  );
  const allUserNames = useMemo(
    () => allUsers.map((user: { id: string; name: string }) => user.name),
    [allUsers]
  );

  const filterPayload: LeaveFiltersType = useMemo(
    () => ({
      user_id: userIdFilter.length > 0 ? userIdFilter : undefined,
      leave_type: leaveTypeFilter.length > 0 ? leaveTypeFilter : undefined,
      from_date: fromDateFilter || undefined,
      to_date: toDateFilter || undefined,
      page: page + PAGE_OPTIONS.ONE,
      page_size: pageSize,
      sort_field: sortField,
      sort_order: sortOrder
    }),
    [
      userIdFilter,
      leaveTypeFilter,
      fromDateFilter,
      toDateFilter,
      page,
      pageSize,
      sortField,
      sortOrder
    ]
  );

  const {
    data: filteredLeaves,
    isLoading,
    totalCount,
    mutate
  } = useGetLeavesWithFilters(filterPayload, true);

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
      mutate();
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

  const hasFiltersApplied =
    userIdFilter.length > 0 || leaveTypeFilter.length > 0 || fromDateFilter || toDateFilter;
  const skeletonloading = isLoading && totalCount === 0 && !hasFiltersApplied;

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
    setPage(0);
  };

  return (
    <>
      <Box marginTop={"15px"}>
        <LeaveFilters
          userIdFilter={userIdFilter}
          leaveTypeFilter={leaveTypeFilter}
          fromDate={fromDateFilter}
          toDate={toDateFilter}
          allUserIds={allUserIds}
          allUserNames={allUserNames}
          allLeaveTypes={leaveTypes}
          onUserIdChange={setUserIdFilter}
          onLeaveTypeChange={setLeaveTypeFilter}
          onFromDateChange={setFromDateFilter}
          onToDateChange={setToDateFilter}
          onClearFilters={handleClearFilters}
          loading={skeletonloading}
        />
      </Box>

      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", overflowY: "auto" }}>
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
                  <Table<LeaveEntry>
                    columns={leaveColumns}
                    rows={filteredLeaves || []}
                    isLoading={isLoading}
                    rowsPerPageOptions={[
                      PAGE_OPTIONS.DEFAULT_ROWS_25,
                      PAGE_OPTIONS.DEFAULT_ROWS_35,
                      PAGE_OPTIONS.DEFAULT_ROWS_45
                    ]}
                    defaultRowsPerPage={PAGE_OPTIONS.DEFAULT_ROWS_25}
                    onPageChange={(newPage, newLimit) => {
                      setPage(newPage);
                      setPageSize(newLimit);
                    }}
                    totalCount={totalCount}
                    onSortChange={(key, order) => {
                      setSortField(key);
                      setSortOrder(order);
                      setPage(0);
                    }}
                  />
                </Box>
              </Box>
            </Paper>
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
