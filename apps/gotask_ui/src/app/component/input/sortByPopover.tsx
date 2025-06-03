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

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Typography variant="body2">Order:</Typography>
            <Tooltip title="Ascending">
              <IconButton
                size="small"
                color={sortOrder === SortOrder.ASC ? "primary" : "default"}
                onClick={() => onSortOrderChange(SortOrder.ASC)}
              >
                <ArrowUpward fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Descending">
              <IconButton
                size="small"
                color={sortOrder === SortOrder.DESC ? "primary" : "default"}
                onClick={() => onSortOrderChange(SortOrder.DESC)}
              >
                <ArrowDownward fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default SortByPopover;
