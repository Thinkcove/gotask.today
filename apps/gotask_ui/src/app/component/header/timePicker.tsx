import React from "react";
import { FormControl, Box, Typography, FormHelperText } from "@mui/material";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { parse, format } from "date-fns";
import { SxProps, Theme } from "@mui/material/styles";

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
      try {
        return parse(timeString, "h:mm a", new Date());
      } catch (error) {
        try {
          return parse(timeString, "HH:mm", new Date());
        } catch (error2) {
          try {
            return parse(timeString, "hh:mm a", new Date());
          } catch (error3) {
            return null;
          }
        }
      }
    };

    const handleTimeChange = (newValue: Date | null): void => {
      if (newValue) {
        const formattedTime = format(newValue, ampm ? "h:mm a" : "HH:mm");
        onChange?.(formattedTime);
      } else {
        onChange?.("");
      }
    };

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
              value={parseTimeValue(value || "")}
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
                  sx: {
                    "& .MuiInputBase-input::placeholder": {
                      color: "#9C8585",
                      opacity: 1
                    },
                    "& .MuiInputBase-input": {
                      color: value ? "inherit" : "#9C8585"
                    }
                  },
                  InputProps: {
                    disableUnderline: true
                    // Removed the InputAdornment with AccessTime icon
                  }
                },
                mobilePaper: {
                  sx: {
                    "& .MuiPickersLayout-root": {
                      "& .MuiTimeClock-root": {
                        "& .MuiClockNumber-root": {
                          "&:hover": {
                            backgroundColor: "#741B92",
                            color: "#fff"
                          },
                          "&.Mui-selected": {
                            backgroundColor: "#741B92",
                            color: "#fff"
                          }
                        }
                      }
                    }
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
