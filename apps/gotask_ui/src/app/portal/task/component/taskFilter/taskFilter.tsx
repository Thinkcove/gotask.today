import { TASK_SEVERITY, TASK_STATUS } from "@/app/common/constants/task";
import DueDateDropdown from "@/app/component/dropDown/dateDropDown";
import FilterDropdown from "@/app/component/dropDown/filterDropDown";
import { Box, Button, Popover, Slider, Typography } from "@mui/material";
import React, { useRef, useState } from "react";

interface Props {
  statusFilter: string[];
  severityFilter: string[];
  projectFilter: string[];
  userFilter: string[];
  allProjects: string[];
  allUsers: string[];
  variationType: "more" | "less" | "";
  variationDays: number;
  dateFrom: string;
  dateTo: string;
  onStatusChange: (val: string[]) => void;
  onSeverityChange: (val: string[]) => void;
  onProjectChange: (val: string[]) => void;
  onUserChange: (val: string[]) => void;
  onDateChange: (from: string, to: string) => void;
  onVariationChange: (type: "more" | "less", days: number) => void;
  onClearFilters: () => void;
  transtask: (key: string) => string;
  hideProjectFilter?: boolean;
  hideUserFilter?: boolean;
}

const TaskFilters: React.FC<Props> = ({
  statusFilter,
  severityFilter,
  projectFilter,
  userFilter,
  allProjects,
  allUsers,
  variationType,
  variationDays,
  dateFrom,
  dateTo,
  onStatusChange,
  onSeverityChange,
  onProjectChange,
  onUserChange,
  onDateChange,
  onVariationChange,
  onClearFilters,
  transtask,
  hideProjectFilter,
  hideUserFilter
}) => {
  const variationRef = useRef<HTMLDivElement | null>(null);
  const [variationPopoverOpen, setVariationPopoverOpen] = useState(false);
  const appliedFilterCount =
    (statusFilter.length > 0 ? 1 : 0) +
    (severityFilter.length > 0 ? 1 : 0) +
    (!hideProjectFilter && projectFilter.length > 0 ? 1 : 0) +
    (!hideUserFilter && userFilter.length > 0 ? 1 : 0) +
    (variationType !== "" ? 1 : 0) +
    (variationDays > 0 ? 1 : 0) +
    (dateFrom !== "" ? 1 : 0) +
    (dateTo !== "" ? 1 : 0);

  return (
    <Box
      sx={{
        px: 3,
        pt: 2,
        pb: 2,
        display: "flex",
        gap: 2,
        flexWrap: "nowrap", // Prevent wrapping
        overflowX: "auto", // Enable horizontal scroll when overflow
        // Optional: hide scrollbar for better UI
        "&::-webkit-scrollbar": {
          height: 6
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#aaa",
          borderRadius: 3
        }
      }}
    >
      <FilterDropdown
        label={transtask("filterstatus")}
        options={Object.values(TASK_STATUS)}
        selected={statusFilter}
        onChange={onStatusChange}
      />
      <FilterDropdown
        label={transtask("filterseverity")}
        options={Object.values(TASK_SEVERITY)}
        selected={severityFilter}
        onChange={onSeverityChange}
      />
      {!hideProjectFilter && (
        <FilterDropdown
          label={transtask("filterproject")}
          options={allProjects}
          selected={projectFilter}
          onChange={onProjectChange}
        />
      )}
      {!hideUserFilter && (
        <FilterDropdown
          label={transtask("filteruser")}
          options={allUsers}
          selected={userFilter}
          onChange={onUserChange}
        />
      )}
      <DueDateDropdown dateFrom={dateFrom} dateTo={dateTo} onDateChange={onDateChange} />
      {/* Variation Dropdown + Popover */}
      <Box ref={variationRef}>
        <FilterDropdown
          label="Variation"
          options={["more", "less"]}
          selected={variationType ? [variationType] : []}
          onChange={(val) => {
            const type = val[0] as "more" | "less";
            onVariationChange(type, variationDays);
            setVariationPopoverOpen(true);
          }}
          singleSelect
        />
      </Box>
      <Popover
        open={variationPopoverOpen}
        anchorEl={variationRef.current}
        onClose={() => setVariationPopoverOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ p: 2, width: 200 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Days Variation
          </Typography>
          <Slider
            value={variationDays}
            onChange={(_, value) => {
              if (variationType === "more" || variationType === "less") {
                onVariationChange(variationType, value as number);
              }
            }}
            step={1}
            marks
            min={1}
            max={30}
            valueLabelDisplay="auto"
            size="small"
          />
        </Box>
      </Popover>
      {appliedFilterCount > 0 && (
        <Button variant="outlined" onClick={onClearFilters}>
          {`Clear Filters (${appliedFilterCount})`}
        </Button>
      )}
    </Box>
  );
};

export default TaskFilters;
