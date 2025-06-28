// components/leaveFilters.tsx
import React from "react";
import { Box, Link } from "@mui/material";
import FilterDropdown from "@/app/component/input/filterDropDown";

interface Props {
  leaveTypeFilter: string[];
  statusFilter: string[];
  userFilter: string[];
  allLeaveTypes: string[];
  allStatuses: string[];
  allUsers: string[];
  onLeaveTypeChange: (val: string[]) => void;
  onStatusChange: (val: string[]) => void;
  onUserChange: (val: string[]) => void;
  onClearFilters: () => void;
  trans: (key: string) => string;
  hideUserFilter?: boolean;
}

const LeaveFilters: React.FC<Props> = ({
  leaveTypeFilter,
  statusFilter,
  userFilter,
  allLeaveTypes,
  allStatuses,
  allUsers,
  onLeaveTypeChange,
  onStatusChange,
  onUserChange,
  onClearFilters,
  trans,
  hideUserFilter = false
}) => {
  const appliedFilterCount =
    (leaveTypeFilter.length > 0 ? 1 : 0) +
    (statusFilter.length > 0 ? 1 : 0) +
    (hideUserFilter ? 0 : userFilter.length > 0 ? 1 : 0);

  const formatLeaveType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "nowrap",
          overflowX: "auto",
          px: 2,
          py: 1,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" }
        }}
      >
        <FilterDropdown
          label={trans("leaveType")}
          options={allLeaveTypes.map(formatLeaveType)}
          selected={leaveTypeFilter.map(formatLeaveType)}
          onChange={(formatted) => {
            const original = formatted.map(f => 
              allLeaveTypes.find(type => formatLeaveType(type) === f) || f.toLowerCase().replace(' ', '_')
            );
            onLeaveTypeChange(original);
          }}
        />
        
        <FilterDropdown
          label={trans("status")}
          options={allStatuses.map(formatStatus)}
          selected={statusFilter.map(formatStatus)}
          onChange={(formatted) => {
            const original = formatted.map(f => f.toLowerCase());
            onStatusChange(original);
          }}
        />

        {!hideUserFilter && (
          <FilterDropdown
            label={trans("user")}
            options={allUsers}
            selected={userFilter}
            onChange={onUserChange}
          />
        )}
      </Box>
      
      {appliedFilterCount > 0 && (
        <Box sx={{ pl: 2, pb: 1 }}>
          <Link
            component="button"
            onClick={onClearFilters}
            underline="always"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 300
            }}
          >
            {`Clear All (${appliedFilterCount})`}
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default LeaveFilters;