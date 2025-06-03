import React from "react";
import {
  Box,
  Button,
  Popover,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  IconButton,
  Tooltip,
  Divider
} from "@mui/material";
import { ArrowUpward, ArrowDownward, Sort } from "@mui/icons-material";
import { SortOrder, TaskSortField } from "@/app/common/constants/task";

interface SortByPopoverProps {
  sortField: TaskSortField;
  sortOrder: SortOrder;
  onSortFieldChange: (value: TaskSortField) => void;
  onSortOrderChange: (value: SortOrder) => void;
}

const SortByPopover: React.FC<SortByPopoverProps> = ({
  sortField,
  sortOrder,
  onSortFieldChange,
  onSortOrderChange
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Button
        size="small"
        variant="outlined"
        startIcon={<Sort />}
        onClick={handleOpen}
        sx={{ textWrap: "nowrap" }}
      >
        Sort By
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            Sort Field
          </Typography>

          <RadioGroup
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as TaskSortField)}
          >
            <FormControlLabel
              value={TaskSortField.DUE_DATE}
              control={<Radio size="small" />}
              label="Due Date"
            />
            <FormControlLabel
              value={TaskSortField.USER_NAME}
              control={<Radio size="small" />}
              label="User"
            />
          </RadioGroup>
          <Divider sx={{ fontSize: "small" }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
              Order:
            </Typography>
          </Box>
          <Box sx={{ alignItems: "center", gap: 2, mt: 1 }}>
            <Tooltip title="Ascending">
              <Box
                onClick={() => onSortOrderChange(SortOrder.ASC)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 0.5,
                  borderRadius: 1,
                  bgcolor: sortOrder === SortOrder.ASC ? "primary.main" : "transparent",
                  color: sortOrder === SortOrder.ASC ? "primary.contrastText" : "text.primary",
                  "&:hover": {
                    bgcolor: sortOrder === SortOrder.ASC ? "primary.dark" : "action.hover"
                  },
                  userSelect: "none"
                }}
              >
                <ArrowUpward fontSize="small" />
                <Typography variant="body2">Ascending</Typography>
              </Box>
            </Tooltip>

            <Tooltip title="Descending">
              <Box
                onClick={() => onSortOrderChange(SortOrder.DESC)}
                sx={{
                  mt: 1,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 0.5,
                  borderRadius: 1,
                  bgcolor: sortOrder === SortOrder.DESC ? "primary.main" : "transparent",
                  color: sortOrder === SortOrder.DESC ? "primary.contrastText" : "text.primary",
                  "&:hover": {
                    bgcolor: sortOrder === SortOrder.DESC ? "primary.dark" : "action.hover"
                  },
                  userSelect: "none"
                }}
              >
                <ArrowDownward fontSize="small" />
                <Typography variant="body2">Descending</Typography>
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default SortByPopover;
