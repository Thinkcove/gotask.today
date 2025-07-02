import { TASK_SEVERITY, TASK_STATUS } from "@/app/common/constants/task";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Link, Popover, Slider, Typography } from "@mui/material";
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
        {canScrollLeft && (
          <IconButton
            onClick={() => scrollBy("left")}
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "white",
              boxShadow: 1
            }}
          >
            <ChevronLeft />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={handleMouseEvents}
          onMouseMove={handleMouseEvents}
          sx={{
            px: 3,
            pt: 2,
            pb: 2,
            display: "flex",
            gap: 2,
            flexWrap: "nowrap",
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none"
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
          <DateDropdown
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateChange={onDateChange}
            transtask={transtask}
          />
          <Box ref={variationRef}>
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

        {canScrollRight && (
          <IconButton
            onClick={() => scrollBy("right")}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "white",
              boxShadow: 1
            }}
          >
            <ChevronRight />
          </IconButton>
        )}
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
