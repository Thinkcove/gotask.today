"use client";

import React from "react";
import { Box } from "@mui/material";
import MultiSelectFilter from "../multiSelect/multiSelectFilter";
import { STATUS_CONFIG } from "@/app/common/constants/status";

interface Props {
  userStatus: string[];
  onStatusChange: (val: string[]) => void;
  onClearStatus: () => void;
  transuser: (key: string) => string;
}

const UserStatusFilter: React.FC<Props> = ({ userStatus, onStatusChange, transuser }) => {
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
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <MultiSelectFilter
            placeholder={transuser("filterstatus")}
            selectedIds={userStatus.includes(STATUS_CONFIG.ALL_STATUS) ? [] : userStatus}
            items={STATUS_CONFIG.STATUS_OPTIONS}
            onChange={handleDropdownChange}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UserStatusFilter;
