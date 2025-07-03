"use client";
import React, { useState, useMemo } from "react";
import { Box, Grid, Paper, IconButton, Tooltip, Typography } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useGetAllLeaves } from "../leaves/services/leaveServices";
import { LeaveEntry } from "../leaves/interface/leave";
import LeaveFiltersComponent from "../leaves/components/leaveFilters";
import Table, { Column } from "@/app/component/table/table";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "@/app/component/searchBar/searchBar";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoAssetsImage from "@assets/placeholderImages/notask.svg";
import { useRouter } from "next/navigation";
import DeleteConfirmationPopup from "../leaves/components/deletebox";
import { useDeleteLeave } from "../leaves/services/leaveServices"; 
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const LeavePage: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [userIdFilter, setUserIdFilter] = useState<string[]>([]);
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string[]>([]);
  const [fromDateFilter, setFromDateFilter] = useState<string>("");
  const [toDateFilter, setToDateFilter] = useState<string>("");
  const [selectedLeave, setSelectedLeave] = useState<LeaveEntry | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false); // State for dialog

  const { data: allLeaves, isLoading, error: allError } = useGetAllLeaves(true);
  const { mutate: deleteLeave, isLoading: isDeleting, error: deleteError } = useDeleteLeave(); // Delete service

  const displayData = useMemo(() => (Array.isArray(allLeaves) ? allLeaves : []), [allLeaves]);

    const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);

  const handleActionClick = () => {
    router.push("/leave/leaves/applyLeave");
  };

  const handleViewClick = (leave: LeaveEntry) => {
    router.push(`/leave/leaves/view/${leave.id}`);
  };

  const handleEditClick = (leave: LeaveEntry) => {
    router.push(`/leave/leaves/edit/${leave.id}`);
  };

  const handleDeleteClick = (leave: LeaveEntry) => {
    setSelectedLeave(leave);
    setIsDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLeave) return;
    try {
      await deleteLeave(selectedLeave.id); // Call the delete service
      setIsDeleteDialogOpen(false); // Close dialog
      setSelectedLeave(null); // Clear selected leave
    } catch (error) {
      console.error("Delete failed:", error);
      setErrorMessage("Failed to delete leave request");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false); // Close dialog
    setSelectedLeave(null); // Clear selected leave
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
        [leave.user_name, leave.leave_type, leave.from_date, leave.to_date, leave.user_id]
          .some((field) => field && field.toString().toLowerCase().includes(searchText.toLowerCase()));
      const matchUserId = userIdFilter.length === 0 || userIdFilter.includes(leave.user_id);
      const matchLeaveType = leaveTypeFilter.length === 0 || leaveTypeFilter.includes(leave.leave_type);
      const matchFromDate = !fromDateFilter || new Date(leave.from_date) >= new Date(fromDateFilter);
      const matchToDate = !toDateFilter || new Date(leave.to_date) <= new Date(toDateFilter);
      return matchSearch && matchUserId && matchLeaveType && matchFromDate && matchToDate;
    });
  };

  const filteredData = useMemo(
    () => filterLeaves(displayData, searchText, userIdFilter, leaveTypeFilter, fromDateFilter, toDateFilter),
    [displayData, searchText, userIdFilter, leaveTypeFilter, fromDateFilter, toDateFilter]
  );

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

  const leaveColumns: Column<LeaveEntry>[] = [
    { id: "user_name", label:transleave("username"), sortable: true },
    { id: "leave_type", label: transleave("leavetype"), sortable: false },
    {
      id: "from_date",
      label: transleave("fromdate"),
      render: (value: string | undefined, row: LeaveEntry) => formatDate(row.from_date || ""),
      sortable: true,
    },
    {
      id: "to_date",
      label: transleave("todate"),
      render: (value: string | undefined, row: LeaveEntry) => formatDate(row.to_date || ""),
      sortable: true,
    },
    {
      id: "actions",
      label: transleave("actions"),
      sortable: false,
      render: (value: string | undefined, row: LeaveEntry) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={transleave("viewdetails")}>
            <IconButton size="small" onClick={() => handleViewClick(row)} sx={{ color: "#741B92" }}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={transleave("editleave")}>
            <IconButton size="small" onClick={() => handleEditClick(row)} sx={{ color: "#741B92" }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={transleave("deleteleave")}>
            <IconButton size="small" onClick={() => handleDeleteClick(row)} sx={{ color: "#741B92" }}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleClearFilters = () => {
    setUserIdFilter([]);
    setLeaveTypeFilter([]);
    setFromDateFilter("");
    setToDateFilter("");
    setSearchText("");
  };

  if (isLoading) {
    return (
      <>
        <ModuleHeader name="leave" />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
       {transleave("loading")}
        </Box>
      </>
    );
  }

  if (allError) {
    return (
      <>
        <ModuleHeader name="leave" />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          {transleave("error")} {allError.message}
        </Box>
      </>
    );
  }

  return (
    <>
      <ModuleHeader name="leave" />
      {errorMessage && (
        <Typography color="error" sx={{ p: 2, textAlign: "center" }}>
          {errorMessage}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: 1,
          px: 2,
          mt: 2,
          flexWrap: "nowrap",
        }}
      >
        <Box sx={{ flex: "1 1 auto", maxWidth: "300px" }}>
          <SearchBar value={searchText} onChange={setSearchText} placeholder="Search Leave" />
        </Box>
      </Box>

      <Box marginTop={"15px"}>
        <LeaveFiltersComponent
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
          trans={(key: string) => key}
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
              <Paper sx={{ p: 2, overflow: "auto", display: "flex", flexDirection: "column", overflowY: "auto" }}>
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

      <DeleteConfirmationPopup
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        leave={selectedLeave}
        isDeleting={isDeleting}
        errorMessage={deleteError?.message}
      />
    </>
  );
};

export default LeavePage;