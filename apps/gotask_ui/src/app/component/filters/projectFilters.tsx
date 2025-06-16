import React, { useRef, useState } from "react";
import {
  Box,
  IconButton,
  Link
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import FilterDropdown from "../input/filterDropDown";
import { ProjectStatuses } from "../../common/constants/project";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

interface ProjectFiltersProps {
  statusFilter: string[];
  userFilter: string[];
  onStatusChange: (selectedStatuses: string[]) => void;
  onUserChange: (selectedUsers: string[]) => void;
  onClearFilters: () => void;
  userOptions: string[];
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  statusFilter,
  userFilter,
  onStatusChange,
  onUserChange,
  onClearFilters,
  userOptions
}) => {
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const appliedFilterCount =
    (statusFilter.length > 0 ? 1 : 0) + (userFilter.length > 0 ? 1 : 0);

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
            label={transproject("status")}
            options={ProjectStatuses.map((status) => status.value)}
            selected={statusFilter}
            onChange={onStatusChange}
          />
          <FilterDropdown
            label={transproject("user")}
            options={userOptions}
            selected={userFilter}
            onChange={onUserChange}
          />
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

    {appliedFilterCount > 0 && (
  <Box sx={{ pl: 3, pb: 2 }}>
    <Link
      component="button"
      onClick={onClearFilters}
      underline="always"
      sx={{
        whiteSpace: "nowrap",
        fontWeight: 500,
        color: "#6A1B9A", // purple matching theme (optional)
        cursor: "pointer",
        fontSize: "14px"
      }}
    >
       {`Clear All (${appliedFilterCount})`}
    </Link>
  </Box>
)}


    </Box>
  );
};

export default ProjectFilters;
