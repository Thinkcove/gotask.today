"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Box, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import Table from "@/app/component/table/table";
import SearchBar from "@/app/component/searchBar/searchBar";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoAssetsImage from "@assets/placeholderImages/notask.svg";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { LeaveEntry } from "../interface/leaveInterface";
import { useDeleteLeave, useGetAllLeaves } from "../services/leaveAction";
import LeaveFilters from "./leaveFilters";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { getLeaveColumns } from "./leaveColumns";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";

const LeaveList: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
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

  const { data: allLeaves, isLoading } = useGetAllLeaves(true);
  const { mutate: deleteLeave } = useDeleteLeave();
  const displayData = useMemo(() => (Array.isArray(allLeaves) ? allLeaves : []), [allLeaves]);
  const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);

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
    } finally {
      setTimeout(() => {}, 100);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedLeave(null);
  };

  const handleActionClick = () => {
    router.push("/leave/applyleave");
  };

  const leaveTypes = useMemo(() => {
    if (!allLeaves || !Array.isArray(allLeaves)) return [];
    return Array.from(new Set(allLeaves.map((leave: LeaveEntry) => leave.leave_type)));
  }, [allLeaves]);

  const userIds = useMemo(() => {
    if (!allLeaves || !Array.isArray(allLeaves)) return [];
    return Array.from(new Set(allLeaves.map((leave: LeaveEntry) => leave.user_id)));
  }, [allLeaves]);

  const userNames = useMemo(() => {
    if (!allLeaves || !Array.isArray(allLeaves)) return [];
    return Array.from(new Set(allLeaves.map((leave: LeaveEntry) => leave.user_name)));
  }, [allLeaves]);

  const filterLeaves = (
    leaves: LeaveEntry[],
    searchText: string,
    userIdFilter: string[],
    leaveTypeFilter: string[],
    fromDateFilter: string,
    toDateFilter: string
  ) => {
    if (!leaves || !Array.isArray(leaves)) return [];
    return leaves.filter((leave) => {
      const matchSearch =
        !searchText ||
        [leave.user_name, leave.leave_type, leave.from_date, leave.to_date, leave.user_id].some(
          (field) => field && field.toString().toLowerCase().includes(searchText.toLowerCase())
        );
      const matchUserId = userIdFilter.length === 0 || userIdFilter.includes(leave.user_id);
      const matchLeaveType =
        leaveTypeFilter.length === 0 || leaveTypeFilter.includes(leave.leave_type);
      const matchFromDate =
        !fromDateFilter || new Date(leave.from_date) >= new Date(fromDateFilter);
      const matchToDate = !toDateFilter || new Date(leave.to_date) <= new Date(toDateFilter);
      return matchSearch && matchUserId && matchLeaveType && matchFromDate && matchToDate;
    });
  };

  const filteredData = useMemo(
    () =>
      filterLeaves(
        displayData,
        searchText,
        userIdFilter,
        leaveTypeFilter,
        fromDateFilter,
        toDateFilter
      ),
    [displayData, searchText, userIdFilter, leaveTypeFilter, fromDateFilter, toDateFilter]
  );

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
    setSearchText("");
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
          <SearchBar value={searchText} onChange={setSearchText} placeholder="Search Leave" />
        </Box>
      </Box>

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
            {!displayData || displayData.length === 0 ? (
              <EmptyState imageSrc={NoAssetsImage} message={transleave("noleave")} />
            ) : filteredData.length === 0 ? (
              <EmptyState imageSrc={NoAssetsImage} message={transleave("nodata")} />
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
                    <Table<LeaveEntry> columns={leaveColumns} rows={filteredData} />
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
