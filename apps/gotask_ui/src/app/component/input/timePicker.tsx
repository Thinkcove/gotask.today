import React from "react";
import { FormControl, Box, Typography, FormHelperText } from "@mui/material";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { parse, format, isValid } from "date-fns";
import { SxProps, Theme } from "@mui/material/styles";
import { formats } from "../dateTime/timePicker";

interface TimePickerFieldProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  onFocus?: () => void;
  sx?: SxProps<Theme>;
  format?: string;
  minutesStep?: number;
  ampm?: boolean;
  ampmInClock?: boolean;
  views?: ("hours" | "minutes")[];
}

const TimePickerField = React.forwardRef<HTMLInputElement, TimePickerFieldProps>(
  function TimePickerField(
    {
      label,
      required,
      placeholder,
      error,
      value,
      onChange,
      disabled = false,
      onFocus,
      sx,
      format: timeFormat = "hh:mm a",
      minutesStep = 1,
      ampm = true,
      ampmInClock = true,
      views = ["hours", "minutes"]
    },
    ref
  ) {
    const parseTimeValue = (timeString: string): Date | null => {
      if (!timeString) return null;

      const baseDate = new Date();
      const year = baseDate.getFullYear();
      const month = baseDate.getMonth();
      const day = baseDate.getDate();

      for (const fmt of formats) {
        const parsed = parse(timeString, fmt, new Date(year, month, day));
        if (isValid(parsed)) {
          return parsed;
        }
      }
      return null;
    };

    const handleTimeChange = (newValue: Date | null): void => {
      if (newValue && isValid(newValue)) {
        onChange?.(format(newValue, "HH:mm:ss"));
      } else {
        onChange?.("");
      }
    };

    const parsedValue = parseTimeValue(value || "");

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FormControl fullWidth margin="normal" error={!!error}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: "linear-gradient(45deg, rgb(235, 211, 243), rgb(229, 223, 230))",
              border: "1px solid #DADADA",
              boxShadow: "2px 4px 10px rgba(0,0,0,0.05)",
              transition: "0.3s",
              "&:focus-within": {
                borderColor: "#741B92",
                backgroundColor: "#fff"
              },
              ...(sx || {})
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              {label}
              {required && <span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>}
            </Typography>

            <MobileTimePicker
              value={parsedValue}
              onChange={handleTimeChange}
              ampmInClock={ampmInClock}
              ampm={ampm}
              views={views}
              format={timeFormat}
              minutesStep={minutesStep}
              disabled={disabled}
              onOpen={onFocus}
              slotProps={{
                textField: {
                  inputRef: ref,
                  variant: "standard",
                  placeholder: placeholder,
                  fullWidth: true,
                  error: !!error,
                  InputProps: {
                    disableUnderline: true
                  }
                }
              }}
            />
          </Box>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      </LocalizationProvider>
    );
  }
);

export default TimePickerField;
