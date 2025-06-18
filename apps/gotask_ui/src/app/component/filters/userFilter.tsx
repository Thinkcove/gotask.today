"use client";

import React, { useRef, useState } from "react";
import { Box, IconButton, Link } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import FilterDropdown from "@/app/component/input/filterDropDown";

interface Props {
  userStatus: string[];
  onStatusChange: (val: string[]) => void;
  onClearStatus: () => void;
  transuser: (key: string) => string;
}

const ALL_STATUS = "All";
const STATUS_OPTIONS = [ALL_STATUS, "Active", "Inactive"];

const UserStatusFilter: React.FC<Props> = ({
  userStatus,
  onStatusChange,
  onClearStatus,
  transuser,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const appliedFilterCount = userStatus.length;

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    }
  };

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
    setTimeout(updateScrollButtons, 300);
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
    setTimeout(updateScrollButtons, 300);
  };

  const handleDropdownChange = (newValue: string[]) => {
    if (newValue.includes(ALL_STATUS)) {
      onStatusChange([]);
    } else {
      onStatusChange(newValue);
    }
  };

const handleClearAll = () => {
//   onStatusChange([]); // or call your parent `onClearStatus([])` appropriately
  onClearStatus();
};


  return (
    <Box>
      <Box sx={{ position: "relative", mb: 1 }}>
        {canScrollLeft && (
          <IconButton
            onClick={handleScrollLeft}
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "white",
              boxShadow: 1,
            }}
          >
            <ChevronLeft />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          onScroll={updateScrollButtons}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            px: 3,
            pb: 1,
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <FilterDropdown
            label={transuser("filterstatus")}
            options={STATUS_OPTIONS}
            selected={userStatus}
            onChange={handleDropdownChange}
          />
        </Box>

        {canScrollRight && (
          <IconButton
            onClick={handleScrollRight}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "white",
              boxShadow: 1,
            }}
          >
            <ChevronRight />
          </IconButton>
        )}
      </Box>

      {appliedFilterCount > 0 && (
        <Box sx={{ pl: 3, pb: 1 }}>
          <Link
            component="button"
            onClick={handleClearAll}
            underline="always"
            sx={{ fontSize: 14 }}
          >
            {`Clear All (${appliedFilterCount})`}
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default UserStatusFilter;
