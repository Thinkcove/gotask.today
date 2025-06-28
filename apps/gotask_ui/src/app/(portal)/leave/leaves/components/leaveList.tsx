import React, { useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { getLeaveColumns, calculateDuration } from "../constants/leaveConstants";
import SearchBar from "@/app/component/searchBar/searchBar";
import LeaveFilters from "./leaveFilters";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoDataImage from "@assets/placeholderImages/notask.svg";
import CreateLeave from "./createLeave";
import { useLeavesWithFilters } from "../services/leaveServices";
import { ILeave, ILeaveDisplayRow } from "../interface/leave";
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';

export const LeaveList: React.FC = () => {
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string[]>([]);
  const [userFilter, setUserFilter] = useState<string[]>([]);
  const [createLeaveOpen, setCreateLeaveOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  const filters = {
    leave_type: leaveTypeFilter[0] as "sick" | "personal" | undefined,
    user_id: userFilter[0] || undefined,
    from_date: searchText || undefined,
    to_date: searchText || undefined,
    page: 1,
    page_size: 10
  };

  const { getAll: leaves, totalCount, totalPages, currentPage, mutate } = useLeavesWithFilters(filters);

  const handleEdit = (row: ILeaveDisplayRow) => {
    router.push(`/leave/edit/${row.id}`);
  };

  const handleView = (row: ILeaveDisplayRow) => {
    router.push(`/leave/view/${row.id}`);
  };

  const handleDelete = (row: ILeaveDisplayRow) => {
    console.log("Delete leave:", row.id);
  };

  const leaveColumns = getLeaveColumns(
    (key: string) => key,
    handleEdit,
    handleView,
    handleDelete
  );

  const handleActionClick = () => {
    setCreateLeaveOpen(true);
  };

  const allUsers: string[] = Array.from(new Set(leaves.map((leave: ILeave) => leave.user_id).filter((user: string): user is string => !!user)));

  const mappedLeaves: ILeaveDisplayRow[] = leaves.map((leave: ILeave) => ({
    id: leave.id || '',
    leaveType: leave.leave_type,
    fromDate: leave.from_date ? new Date(leave.from_date).toLocaleDateString() : '-',
    toDate: leave.to_date ? new Date(leave.to_date).toLocaleDateString() : '-',
    duration: leave.from_date && leave.to_date 
      ? calculateDuration(leave.from_date.toString(), leave.to_date.toString()) 
      : '-',
    appliedDate: leave.created_at ? new Date(leave.created_at).toLocaleDateString() : '-'
  }));

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    filters.page = model.page + 1;
    filters.page_size = model.pageSize;
    mutate();
  };

  return (
    <>
      <ModuleHeader name="Leave" />
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
            placeholder="Search by Date"
          />
        </Box>
      </Box>

      <Box marginTop={"15px"}>
        <LeaveFilters
          leaveTypeFilter={leaveTypeFilter}
          userFilter={userFilter}
          allLeaveTypes={['sick', 'personal']}
          allUsers={allUsers}
          onLeaveTypeChange={setLeaveTypeFilter}
          onUserChange={setUserFilter}
          onClearFilters={() => {
            setLeaveTypeFilter([]);
            setUserFilter([]);
            setSearchText("");
          }}
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
                message="No leaves available"
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
                    <DataGrid 
                      rows={mappedLeaves} 
                      columns={leaveColumns} 
                      autoHeight 
                      getRowId={(row) => row.id} 
                      paginationMode="server"
                      rowCount={totalCount}
                      pageSizeOptions={[5, 10, 20]}
                      paginationModel={{ page: currentPage - 1, pageSize: filters.page_size }}
                      onPaginationModelChange={handlePaginationModelChange}
                    />
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
          label="Create Leave"
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
      />
    </>
  );
};

export default LeaveList;