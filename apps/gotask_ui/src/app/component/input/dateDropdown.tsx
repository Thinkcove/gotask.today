import React, { useState } from "react";
import { Button, Popover, Box, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

interface DateDropdownProps {
  dateFrom: string;
  dateTo: string;
  onDateChange: (from: string, to: string) => void;
}

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: 220,
  height: 42,
  borderRadius: 12,
  textTransform: "none",
  fontWeight: 500,
  color: "grey",
  opacity: 1,
  borderColor: theme.palette.grey[400],
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    borderColor: "black"
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: 120,
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    height: 42,
    backgroundColor: theme.palette.background.paper,
    paddingRight: 8,
    "& fieldset": {
      borderColor: theme.palette.grey[300]
    },
    "&:hover fieldset": {
      borderColor: theme.palette.grey[500]
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main
    }
  },
  "& .MuiInputLabel-root": {
    fontSize: 14,
    color: theme.palette.text.secondary
  },
  "& .MuiInputLabel-shrink": {
    color: theme.palette.text.secondary
  },
  "& input[type=date]": {
    padding: "10px 12px",
    fontSize: 14,
    color: theme.palette.text.primary
  }
}));

const DateDropdown: React.FC<DateDropdownProps> = ({ dateFrom, dateTo, onDateChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tempFrom, setTempFrom] = useState(dateFrom);
  const [tempTo, setTempTo] = useState(dateTo);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (tempFrom && tempTo) {
      onDateChange(tempFrom, tempTo);
    }
  };

  return (
    <>
      <StyledButton variant="outlined" onClick={handleOpen}>
        {dateFrom && dateTo ? `${dateFrom} - ${dateTo}` : "Due Date"}
      </StyledButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{ p: 2 }}
      >
        <Box sx={{ display: "flex", gap: 2, p: 2 }}>
          <StyledTextField
            label="From"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={tempFrom}
            onChange={(e) => setTempFrom(e.target.value)}
            size="small"
          />
          <StyledTextField
            label="To"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={tempTo}
            onChange={(e) => setTempTo(e.target.value)}
            size="small"
          />
        </Box>
      </Popover>
    </>
  );
};

export default DateDropdown;
