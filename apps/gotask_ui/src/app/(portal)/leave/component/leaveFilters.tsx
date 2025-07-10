import React from "react";
import { Box, Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import FilterDropdown from "@/app/component/input/filterDropDown";
import { leaveFilterProps } from "../interface/leaveInterface";
import DateDropdown from "@/app/component/input/dateDropdown";

const LeaveFilters: React.FC<leaveFilterProps> = ({
  userIdFilter,
  leaveTypeFilter,
  fromDate,
  toDate,
  allUserIds,
  allUserNames,
  allLeaveTypes,
  onUserIdChange,
  onLeaveTypeChange,
  onFromDateChange,
  onToDateChange,
  onClearFilters
}) => {
  const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);

  // Handler for user selection - maps usernames back to user IDs
  const handleUserChange = (selectedUsernames: string[]) => {
    const selectedUserIds = selectedUsernames.map((username) => {
      const index = allUserNames.findIndex((name) => name === username);
      return index !== -1 ? allUserIds[index] : username;
    });
    onUserIdChange(selectedUserIds);
  };

  // Get selected usernames for display
  const selectedUsernames = userIdFilter.map((userId) => {
    const index = allUserIds.findIndex((id) => id === userId);
    return index !== -1 ? allUserNames[index] : userId;
  });

  // Handler for date range changes
  const handleDateChange = (from: string, to: string) => {
    onFromDateChange(from);
    onToDateChange(to);
  };

  const appliedFilterCount =
    (userIdFilter.length > 0 ? 1 : 0) +
    (leaveTypeFilter.length > 0 ? 1 : 0) +
    (fromDate ? 1 : 0) +
    (toDate ? 1 : 0);

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
        {/* User Name Filter (displaying usernames, filtering by user_id) */}
        <FilterDropdown
          label={transleave("username")}
          options={allUserNames}
          selected={selectedUsernames}
          onChange={handleUserChange}
        />

        {/* Leave Type Filter */}
        <FilterDropdown
          label={transleave("leavetype")}
          options={allLeaveTypes}
          selected={leaveTypeFilter}
          onChange={onLeaveTypeChange}
        />
        {/* Date Range Filter using DateDropdown */}
        <DateDropdown
          dateFrom={fromDate || ""}
          dateTo={toDate || ""}
          onDateChange={handleDateChange}
          transtask={transleave}
          placeholder={transleave("daterange")}
        />
      </Box>
      {/* Clear All Link - Always visible below filter bar */}
      {appliedFilterCount > 0 && (
        <Box sx={{ pr: 3, display: "flex", justifyContent: "flex-end" }}>
          <Link
            component="button"
            onClick={onClearFilters}
            underline="always"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 350,
              fontWeight: 600
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
