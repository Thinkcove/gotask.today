"use client";

import React, { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import MultiSelectFilter from "../multiSelect/multiSelectFilter";
import { STATUS_CONFIG } from "@/app/common/constants/status";

interface Props {
  userStatus: string[];
  onStatusChange: (val: string[]) => void;
  onClearStatus: () => void;
  transuser: (key: string) => string;
}

const UserStatusFilter: React.FC<Props> = ({ userStatus, onStatusChange, transuser }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
    if (newValue.includes("__all__")) {
      onStatusChange([STATUS_CONFIG.ALL_STATUS]);
    } else {
      onStatusChange(newValue);
    }
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
              boxShadow: 1
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
            pl: { xs: 0, md: 0 },
            pb: 1,
            "&::-webkit-scrollbar": {
              display: "none"
            }
          }}
        >
          <MultiSelectFilter
            placeholder={transuser("filterstatus")}
            selectedIds={userStatus.includes(STATUS_CONFIG.ALL_STATUS) ? [] : userStatus}
            items={STATUS_CONFIG.STATUS_OPTIONS}
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
              boxShadow: 1
            }}
          >
            <ChevronRight />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default UserStatusFilter;
