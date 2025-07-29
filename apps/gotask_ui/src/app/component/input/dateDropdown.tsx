"use client";

import React, { useState } from "react";
import { Button, Popover, TextField, Typography, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ClearIcon from "@mui/icons-material/Close";

interface DateDropdownProps {
  dateFrom: string;
  dateTo: string;
  onDateChange: (from: string, to: string) => void;
  transtask: (key: string) => string;
  singleDateMode?: boolean;
  placeholder?: string;
}

const StyledTrigger = styled(Button)(({ theme }) => ({
  height: 42,
  borderRadius: 12,
  textTransform: "none",
  padding: "0 12px",
  fontWeight: 500,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.grey[500],
  opacity: 1,
  borderColor: theme.palette.grey[400],
  display: "flex",
  justifyContent: "space-between",
  minWidth: 240,
  "&:hover": {
    borderColor: theme.palette.primary.main
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: 150,
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    fontSize: 14,
    height: 42,
    backgroundColor: theme.palette.background.paper
  },
  "& .MuiInputLabel-root": {
    fontSize: 13
  }
}));

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

const DateDropdown: React.FC<DateDropdownProps> = ({
  dateFrom,
  dateTo,
  onDateChange,
  transtask,
  singleDateMode = false,
  placeholder
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // Internal state to hold temporary date selections
  const [tempDateFrom, setTempDateFrom] = useState<string>("");
  const [tempDateTo, setTempDateTo] = useState<string>("");

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Initialize temp dates with current values when opening
    setTempDateFrom(dateFrom);
    setTempDateTo(dateTo);
    setAnchorEl(event.currentTarget);
  };

  const handleFromChange = (value: string) => {
    if (singleDateMode) {
      setTempDateFrom(value);
      setTempDateTo(value);
    } else {
      setTempDateFrom(value);
    }
  };

  const handleToChange = (value: string) => {
    setTempDateTo(value);
  };

  const handleClear = () => {
    setTempDateFrom("");
    setTempDateTo("");
    onDateChange("", "");
    setAnchorEl(null);
  };

  const handleApply = () => {
    // Only trigger onDateChange when Apply is clicked
    onDateChange(tempDateFrom, tempDateTo);
    setAnchorEl(null);
  };

  const handleClose = () => {
    // Reset temp dates to original values if closed without applying
    setTempDateFrom(dateFrom);
    setTempDateTo(dateTo);
    setAnchorEl(null);
  };

  const formattedLabel =
    singleDateMode && dateFrom
      ? formatDate(dateFrom)
      : dateFrom && dateTo
        ? `${formatDate(dateFrom)} – ${formatDate(dateTo)}`
        : dateFrom
          ? formatDate(dateFrom)
          : dateTo
            ? formatDate(dateTo)
            : placeholder || transtask("filterduedate");

  return (
    <>
      <StyledTrigger
        variant="outlined"
        onClick={handleOpen}
        startIcon={<CalendarMonthIcon fontSize="small" />}
      >
        <Typography
          variant="body2"
          sx={{
            flexGrow: 1,
            textAlign: "left",
            color: dateFrom || dateTo ? "text.primary" : "text.secondary"
          }}
        >
          {formattedLabel}
        </Typography>
      </StyledTrigger>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{ sx: { p: 2, borderRadius: 2, minWidth: 360 } }}
      >
        <Stack spacing={2}>
          {singleDateMode ? (
            <StyledTextField
              label={transtask("filtercreateddate")}
              type="date"
              InputLabelProps={{ shrink: true }}
              value={tempDateFrom}
              onChange={(e) => handleFromChange(e.target.value)}
            />
          ) : (
            <Stack direction="row" spacing={2}>
              <StyledTextField
                label={transtask("filterfrom")}
                type="date"
                InputLabelProps={{ shrink: true }}
                value={tempDateFrom}
                onChange={(e) => handleFromChange(e.target.value)}
              />
              <StyledTextField
                label={transtask("filterto")}
                type="date"
                InputLabelProps={{ shrink: true }}
                value={tempDateTo}
                onChange={(e) => handleToChange(e.target.value)}
              />
            </Stack>
          )}

          <Stack direction="row" justifyContent="space-between">
            <Button
              onClick={handleClear}
              size="small"
              color="inherit"
              startIcon={<ClearIcon fontSize="small" />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                color: (theme) => theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: "action.hover"
                }
              }}
            >
              {transtask("filterclear")}
            </Button>
            <Button
              onClick={handleApply}
              variant="contained"
              size="small"
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              {transtask("filterapply")}
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
};

export default DateDropdown;