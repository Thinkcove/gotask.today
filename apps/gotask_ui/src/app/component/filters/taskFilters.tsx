import { TASK_SEVERITY, TASK_STATUS } from "@/app/common/constants/task";
import { Box, Link, Popover, Slider, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import FilterDropdown from "../input/filterDropDown";
import DateDropdown from "../input/dateDropdown";

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
  onVariationChange: (type: "more" | "less" | "", days: number) => void;
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
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [variationPopoverOpen, setVariationPopoverOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  let appliedFilterCount = 0;

  if (statusFilter.length > 0) appliedFilterCount += 1;
  if (severityFilter.length > 0) appliedFilterCount += 1;
  if (!hideProjectFilter && projectFilter.length > 0) appliedFilterCount += 1;
  if (!hideUserFilter && userFilter.length > 0) appliedFilterCount += 1;
  if (variationDays > 0) appliedFilterCount += 1;
  if (typeof dateFrom === "string" && dateFrom.trim() !== "") appliedFilterCount += 1;
  if (typeof dateTo === "string" && dateTo.trim() !== "") appliedFilterCount += 1;

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    }
  };

  const handleScroll = () => updateScrollButtons();
  const handleMouseEvents = () => updateScrollButtons();

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
      setTimeout(updateScrollButtons, 300);
    }
  };

  return (
    <Box>
      <Box sx={{ position: "relative" }}>
        <Box
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={handleMouseEvents}
          onMouseMove={handleMouseEvents}
          sx={{
            py: 2,
            px: { xs: 2, md: 3 },
            display: "flex",
            gap: 2,
            flexWrap: "nowrap",
            overflowX: "auto",
            minWidth: 0,
            width: "100%",
            flexGrow: 1,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none"
            }
          }}
        >
          <Box sx={{ minWidth: 150, flexShrink: 0 }}>
            <FilterDropdown
              label={transtask("filterstatus")}
              options={Object.values(TASK_STATUS)}
              selected={statusFilter}
              onChange={onStatusChange}
            />
          </Box>
          <Box sx={{ minWidth: 150, flexShrink: 0 }}>
            <FilterDropdown
              label={transtask("filterseverity")}
              options={Object.values(TASK_SEVERITY)}
              selected={severityFilter}
              onChange={onSeverityChange}
            />
          </Box>
          {!hideProjectFilter && (
            <Box sx={{ minWidth: 150, flexShrink: 0 }}>
              <FilterDropdown
                label={transtask("filterproject")}
                options={allProjects}
                selected={projectFilter}
                onChange={onProjectChange}
              />
            </Box>
          )}
          {!hideUserFilter && (
            <Box sx={{ minWidth: 150, flexShrink: 0 }}>
              <FilterDropdown
                label={transtask("filteruser")}
                options={allUsers}
                selected={userFilter}
                onChange={onUserChange}
              />
            </Box>
          )}
          <Box sx={{ minWidth: 150, flexShrink: 0 }}>
            <DateDropdown
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateChange={onDateChange}
              transtask={transtask}
              placeholder={transtask("filterplannedenddate")}
            />
          </Box>
          <Box sx={{ minWidth: 150, flexShrink: 0 }} ref={variationRef}>
            <FilterDropdown
              label={transtask("filtervariation")}
              options={["more", "less"]}
              selected={variationType ? [variationType] : []}
              onChange={(val) => {
                if (val.length === 0) {
                  onVariationChange("", 0);
                  setVariationPopoverOpen(false);
                } else {
                  const type = val[0] as "more" | "less";
                  onVariationChange(type, variationDays);
                  setVariationPopoverOpen(true);
                }
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
                {transtask("daysvariation")}
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
        </Box>
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

export default TaskFilters;
