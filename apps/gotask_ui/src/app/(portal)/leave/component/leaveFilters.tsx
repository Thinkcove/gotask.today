import React from "react";
import { Box, Link, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import MultiSelectFilter from "@/app/component/multiSelect/multiSelectFilter";
import { Item, Props } from "../interface/leaveInterface";


const LeaveFilters: React.FC<Props> = ({
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

  // Convert user IDs and names to Item interface for MultiSelectFilter
  const userItems: Item[] = allUserIds.map((id, index) => ({
    id,
    name: allUserNames[index] || id
  }));

  // Convert leave types to Item interface for MultiSelectFilter
  const leaveTypeItems: Item[] = allLeaveTypes.map((type) => ({
    id: type,
    name: type
  }));

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
        <MultiSelectFilter
          placeholder={transleave("username")}
          selectedIds={userIdFilter}
          items={userItems}
          onChange={onUserIdChange}
          sxRoot={{ minWidth: 200, width: 200 }}
          listBoxProps={{
            style: {
              maxHeight: 200,
              width: 250
            }
          }}
        />

        {/* Leave Type Filter */}
        <MultiSelectFilter
          placeholder={transleave("leavetype")}
          selectedIds={leaveTypeFilter}
          items={leaveTypeItems}
          onChange={onLeaveTypeChange}
          sxRoot={{ minWidth: 200, width: 200 }}
          listBoxProps={{
            style: {
              maxHeight: 200,
              width: 250
            }
          }}
        />

        {/* From Date Filter */}
        <TextField
          label={transleave("fromdate")}
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "1rem"
            }
          }}
          InputProps={{
            sx: {
              height: 40
            }
          }}
        />

        {/* To Date Filter */}
        <TextField
          label={transleave("todate")}
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "1rem"
            }
          }}
          InputProps={{
            sx: {
              height: 40
            }
          }}
        />
      </Box>

      {/* Clear Filters Link */}
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
              maxWidth: 300,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem"
            }}
          >
            {transleave("clearall")} ({appliedFilterCount})
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default LeaveFilters;
