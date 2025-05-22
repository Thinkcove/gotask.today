// components/TaskFilterControls.tsx
import React from "react";
import { Button, Box, Typography, Badge } from "@mui/material";
import { FilterAltOutlined, Clear } from "@mui/icons-material";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface TaskFilterControlsProps {
  activeFilterCount: number;
  isFiltered: boolean;
  onClearAll: () => void;
  onOpenFilter: () => void;
}

const TaskFilterControls: React.FC<TaskFilterControlsProps> = ({
  activeFilterCount,
  isFiltered,
  onClearAll,
  onOpenFilter
}) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 2,
        px: 3,
        mt: 2,
        mb: 1,
        flexWrap: "wrap"
      }}
    >
      {isFiltered && (
        <Button variant="text" color="error" startIcon={<Clear />} onClick={onClearAll}>
          {transtask("clearall") || "Clear All"}
        </Button>
      )}

      <Badge
        badgeContent={activeFilterCount > 0 ? activeFilterCount : null}
        color="primary"
        overlap="circular"
      >
        <Button variant="outlined" startIcon={<FilterAltOutlined />} onClick={onOpenFilter}>
          {transtask("filters") || "Filters"}
        </Button>
      </Badge>
    </Box>
  );
};

export default TaskFilterControls;
