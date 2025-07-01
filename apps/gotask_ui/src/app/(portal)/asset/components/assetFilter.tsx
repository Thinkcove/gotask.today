import React from "react";
import { Box, Link } from "@mui/material";
import FilterDropdown from "@/app/component/input/filterDropDown";
import DateDropdown from "@/app/component/input/dateDropdown";

interface Props {
  modelNameFilter: string[];
  assignedToFilter: string[];
  allModelNames: string[];
  allUsers: string[];
  onModelNameChange: (val: string[]) => void;
  onAssignedToChange: (val: string[]) => void;
  onClearFilters: () => void;
  trans: (key: string) => string;
  hideModelNameFilter?: boolean;
  hideAssignedToFilter?: boolean;

  statusFilter?: string[];
  allStatuses?: string[];
  onStatusChange?: (val: string[]) => void;
  dateFrom?: string;
  dateTo?: string;
  onDateChange?: (from: string, to: string) => void;
  systemTypeFilter?: string[];
  allSystemTypes?: string[];
  onSystemTypeChange?: (val: string[]) => void;
}

const AssetFilters: React.FC<Props> = ({
  modelNameFilter,
  assignedToFilter,
  allModelNames,
  allUsers,
  onModelNameChange,
  onAssignedToChange,
  onClearFilters,
  trans,
  hideModelNameFilter,
  hideAssignedToFilter,
  statusFilter,
  allStatuses,
  onStatusChange,
  dateFrom,
  dateTo,
  onDateChange,
  systemTypeFilter,
  allSystemTypes,
  onSystemTypeChange
}) => {
  const appliedFilterCount =
    (hideModelNameFilter ? 0 : modelNameFilter.length > 0 ? 1 : 0) +
    (hideAssignedToFilter ? 0 : assignedToFilter.length > 0 ? 1 : 0) +
    (systemTypeFilter && systemTypeFilter.length > 0 ? 1 : 0) +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0);

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
        {!hideModelNameFilter && (
          <FilterDropdown
            label={trans("modelname")}
            options={allModelNames}
            selected={modelNameFilter}
            onChange={onModelNameChange}
          />
        )}
        {!hideAssignedToFilter && (
          <FilterDropdown
            label={trans("assignedTo")}
            options={allUsers}
            selected={assignedToFilter}
            onChange={onAssignedToChange}
          />
        )}
        {onDateChange && (
          <DateDropdown
            dateFrom={dateFrom || ""}
            dateTo={dateTo || ""}
            onDateChange={onDateChange}
            transtask={trans}
            placeholder={trans("warranty")}
          />
        )}
        {allSystemTypes && onSystemTypeChange && (
          <FilterDropdown
            label={trans("systemtype")}
            options={allSystemTypes}
            selected={systemTypeFilter || []}
            onChange={onSystemTypeChange}
          />
        )}

        {allStatuses && onStatusChange && (
          <FilterDropdown
            label={trans("status")}
            options={allStatuses}
            selected={statusFilter || []}
            onChange={onStatusChange}
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

export default AssetFilters;
