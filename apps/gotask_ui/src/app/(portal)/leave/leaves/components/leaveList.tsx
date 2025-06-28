import React, { useState, useMemo } from "react";
import { Box, Grid, Paper } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { getLeaveColumns, calculateDuration, LEAVE_TYPES, LEAVE_STATUSES } from "../constants/leaveConstants";
import SearchBar from "@/app/component/searchBar/searchBar";
import LeaveFilters from "./leaveFilters";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoDataImage from "@assets/placeholderImages/notask.svg";
import CreateLeave from "./createLeave";
import { useAllLeaves } from "../services/leaveServices";
import { ILeave, ILeaveDisplayRow } from "../interface/leave";
import { DataGrid } from '@mui/x-data-grid';

export const LeaveList: React.FC = () => {
  const transleave = useTranslations("leave");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [userFilter, setUserFilter] = useState<string[]>([]);
  const [createLeaveOpen, setCreateLeaveOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  const { getAll: allLeaves, mutate } = useAllLeaves();

  const handleEdit = (row: ILeaveDisplayRow) => {
    router.push(`/leave/edit/${row.id}`);
  };

  const handleView = (row: ILeaveDisplayRow) => {
    router.push(`/leave/view/${row.id}`);
  };

  const handleDelete = (row: ILeaveDisplayRow) => {
    console.log("Delete leave:", row.id);
  };

  const leaveColumns = getLeaveColumns(transleave, handleEdit, handleView, handleDelete);

  const handleActionClick = () => {
    setCreateLeaveOpen(true);
  };

  const allUsers: string[] = useMemo(() =>
    Array.from(
      new Set(
        allLeaves
          .map((leave: ILeave) => leave.user_id)
          .filter((user: string): user is string => !!user)
      )
    ),
    [allLeaves]
  );

  const filterLeaves = (
    leaves: ILeave[],
    searchText: string,
    leaveTypeFilter: string[],
    statusFilter: string[],
    userFilter: string[]
  ) => {
    const lowerSearch = searchText.toLowerCase();
    return leaves.filter((leave) => {
      const matchBasic =
        searchText.trim() === "" ||
        [
          leave.leave_type,
          leave.reason,
          leave.status,
          leave.user_id
        ]
          .filter(Boolean)
          .some((field) => field!.toString().toLowerCase().includes(lowerSearch));

      const matchLeaveType =
        leaveTypeFilter.length === 0 ||
        leaveTypeFilter.includes(leave.leave_type);

      const matchStatus =
        statusFilter.length === 0 ||
        statusFilter.includes(leave.status || 'pending');

      const matchUser =
        userFilter.length === 0 ||
        userFilter.includes(leave.user_id);

      return matchBasic && matchLeaveType && matchStatus && matchUser;
    });
  };

  const filteredLeaves = filterLeaves(allLeaves, searchText, leaveTypeFilter, statusFilter, userFilter);

  const mappedLeaves: ILeaveDisplayRow[] = filteredLeaves.map((leave) => ({
    id: leave.id || '',
    leaveType: leave.leave_type,
    fromDate: leave.from_date ? new Date(leave.from_date).toLocaleDateString() : '-',
    toDate: leave.to_date ? new Date(leave.to_date).toLocaleDateString() : '-',
    duration: leave.from_date && leave.to_date 
      ? calculateDuration(leave.from_date.toString(), leave.to_date.toString()) 
      : '-',
    status: leave.status || 'pending',
    reason: leave.reason || '-',
    appliedDate: leave.applied_date ? new Date(leave.applied_date).toLocaleDateString() : 
                  (leave.created_at ? new Date(leave.created_at).toLocaleDateString() : '-'),
    approvedBy: leave.approved_by || undefined
  }));

  return (
    <>
      <ModuleHeader name={"leave"} />
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
        <Box
          sx={{
            flex: "1 1 auto",
            maxWidth: "300px"
          }}
        >
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder={transleave("searchLeave")}
          />
        </Box>
      </Box>

      <Box marginTop={"15px"}>
        <LeaveFilters
          leaveTypeFilter={leaveTypeFilter}
          statusFilter={statusFilter}
          userFilter={userFilter}
          allLeaveTypes={LEAVE_TYPES}
          allStatuses={LEAVE_STATUSES}
          allUsers={allUsers}
          onLeaveTypeChange={setLeaveTypeFilter}
          onStatusChange={setStatusFilter}
          onUserChange={setUserFilter}
          onClearFilters={() => {
            setLeaveTypeFilter([]);
            setStatusFilter([]);
            setUserFilter([]);
            setSearchText("");
          }}
          trans={transleave}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto"
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            {mappedLeaves.length === 0 ? (
              <EmptyState
                imageSrc={NoDataImage}
                message={
                  searchText || leaveTypeFilter.length || statusFilter.length || userFilter.length
                    ? transleave("nodata")
                    : transleave("noleave")
                }
              />
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
                  <Box sx={{ minWidth: 1000 }}>
                    <DataGrid rows={mappedLeaves} columns={leaveColumns} autoHeight getRowId={(row) => row.id} />
                  </Box>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1300
        }}
      >
        <ActionButton
          label={transleave("createLeave")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={handleActionClick}
        />
      </Box>

      <CreateLeave 
        open={createLeaveOpen} 
        onClose={() => setCreateLeaveOpen(false)}
        onSuccess={() => {
          mutate();
        }}
        trans={transleave}
      />
    </>
  );
};

export default LeaveList;