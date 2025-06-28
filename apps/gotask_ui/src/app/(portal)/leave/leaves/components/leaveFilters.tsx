import React from "react";
import { Box, Link } from "@mui/material";
import FilterDropdown from "@/app/component/input/filterDropDown";

interface Props {
  leaveTypeFilter: string[];
  userFilter: string[];
  allLeaveTypes: string[];
  allUsers: string[];
  onLeaveTypeChange: (val: string[]) => void;
  onUserChange: (val: string[]) => void;
  onClearFilters: () => void;
}

const LeaveFilters: React.FC<Props> = ({
  leaveTypeFilter,
  userFilter,
  allLeaveTypes,
  allUsers,
  onLeaveTypeChange,
  onUserChange,
  onClearFilters
}) => {
  const appliedFilterCount =
    (leaveTypeFilter.length > 0 ? 1 : 0) +
    (userFilter.length > 0 ? 1 : 0);

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
          label="Leave Type"
          options={allLeaveTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1))}
          selected={leaveTypeFilter.map(type => type.charAt(0).toUpperCase() + type.slice(1))}
          onChange={(formatted) => {
            const original = formatted.map(f => f.toLowerCase());
            onLeaveTypeChange(original);
          }}
        />
        
        <FilterDropdown
          label="User"
          options={allUsers}
          selected={userFilter}
          onChange={onUserChange}
        />
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