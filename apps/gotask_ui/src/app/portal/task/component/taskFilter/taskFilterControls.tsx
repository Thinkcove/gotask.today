// components/TaskFilterControls.tsx
import React from "react";
import { Button, Box } from "@mui/material";
import { FilterAltOutlined } from "@mui/icons-material";

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
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 3, gap: 2 }}>
      {activeFilterCount > 0 && isFiltered && (
        <Button
          variant="outlined"
          onClick={onClearAll}
          sx={{
            bgcolor: "white",
            textTransform: "none",
            borderColor: "white",
            color: "#741B92"
          }}
        >
          Clear All
        </Button>
      )}
      <Button
        variant="contained"
        onClick={onOpenFilter}
        endIcon={<FilterAltOutlined fontSize="small" />}
        sx={{
          bgcolor: "#741B92",
          color: "#fff",
          textTransform: "none",
          "&:hover": { bgcolor: "#5e1574" }
        }}
      >
        Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
      </Button>
    </Box>
  );
};

export default TaskFilterControls;
