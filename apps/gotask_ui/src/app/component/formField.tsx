import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  Box,
  Typography,
  FormHelperText,
  InputAdornment,
  Checkbox
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowDropDown, CalendarMonth, Edit, Visibility, VisibilityOff } from "@mui/icons-material";

export interface SelectOption {
  name: string;
  id: string;
}

interface FormFieldProps {
  label: string;
  type: "text" | "select" | "date" | "multiselect"; // added "multiselect"
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[] | string[];
  value?: string | number | Date | string[];
  onChange?: (value: string | number | Date | string[]) => void;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  height?: number;
  onFocus?: () => void;
  inputType?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  options,
  required,
  placeholder,
  error,
  value,
  onChange,
  disabled = false,
  multiline = false,
  height,
  onFocus,
  inputType
}) => {
  // State to handle password visibility
  const [passwordVisible, setPasswordVisible] = useState(true);

  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          background: "linear-gradient(45deg, rgb(235, 211, 243), rgb(229, 223, 230))",
          border: "1px solid #DADADA",
          boxShadow: "2px 4px 10px rgba(0,0,0,0.05)",
          transition: "0.3s",
          "&:focus-within": { borderColor: "#741B92", backgroundColor: "#fff" }
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
          {label}
        </Typography>

        {type === "text" && inputType === "password" ? (
          <TextField
            variant="standard"
            required={required}
            placeholder={placeholder}
            error={!!error}
            fullWidth
            multiline={multiline}
            value={value}
            disabled={disabled}
            onFocus={onFocus}
            type={passwordVisible ? "text" : "password"} // Toggle between text and password
            sx={{
              "& .MuiInputBase-input::placeholder": {
                color: "#9C8585",
                opacity: 1
              },
              ...(multiline && { height: height || 100, overflowY: "auto" })
            }}
            onChange={(e) => {
              const val = e.target.value;
              onChange?.(val);
            }}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  {passwordVisible ? (
                    <Visibility
                      sx={{ color: "#9C8585", cursor: "pointer" }}
                      onClick={() => setPasswordVisible(false)}
                    />
                  ) : (
                    <VisibilityOff
                      sx={{ color: "#9C8585", cursor: "pointer" }}
                      onClick={() => setPasswordVisible(true)}
                    />
                  )}
                </InputAdornment>
              )
            }}
          />
        ) : (
          type === "text" && (
            <TextField
              variant="standard"
              required={required}
              placeholder={placeholder}
              error={!!error}
              fullWidth
              multiline={multiline}
              value={value}
              disabled={disabled}
              onFocus={onFocus}
              type={inputType || "text"}
              sx={{
                "& .MuiInputBase-input::placeholder": {
                  color: "#9C8585",
                  opacity: 1
                },
                ...(multiline && { height: height || 100, overflowY: "auto" })
              }}
              onChange={(e) => {
                let val = e.target.value;
                // If inputType is "tel", restrict to numbers, spaces, +, -, (, )
                if (inputType === "tel") {
                  val = val.replace(/[^\d\s()+-]/g, "");
                }
                onChange?.(val);
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Edit sx={{ color: "#9C8585" }} />
                  </InputAdornment>
                )
              }}
            />
          )
        )}

        {type === "select" && (
          <Select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            displayEmpty
            variant="standard"
            fullWidth
            error={!!error}
            disabled={disabled}
            disableUnderline
            IconComponent={ArrowDropDown}
            sx={{
              "& .MuiSelect-select": {
                color: value ? "inherit" : "#9C8585", // Apply color only when placeholder is visible
                opacity: 1
              }
            }}
          >
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
            {options?.map((option, index) =>
              typeof option === "string" ? (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ) : (
                <MenuItem key={index} value={option.id}>
                  {option.name}
                </MenuItem>
              )
            )}
          </Select>
        )}

        {type === "date" && (
          <DatePicker
            selected={
              value instanceof Date ? value : value ? new Date(value as string | number) : null
            }
            onChange={(date) => onChange?.(date ? date.toISOString().split("T")[0] : "")}
            disabled={disabled}
            dateFormat="MM/dd/yyyy"
            customInput={
              <TextField
                variant="standard"
                fullWidth
                placeholder={placeholder}
                error={!!error}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth sx={{ color: "#9C8585" }} />
                    </InputAdornment>
                  )
                }}
              />
            }
          />
        )}

        {type === "multiselect" && (
          <Select
            multiple
            value={Array.isArray(value) ? value : []}
            onChange={(e) =>
              onChange?.(
                typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value
              )
            }
            displayEmpty
            variant="standard"
            fullWidth
            error={!!error}
            disabled={disabled}
            disableUnderline
            IconComponent={ArrowDropDown}
            renderValue={(selected) =>
              (selected as string[]).length === 0
                ? placeholder
                : (selected as string[])
                    .map((val) => {
                      const found =
                        (options as SelectOption[])?.find((opt) => opt.id === val)?.name || val;
                      return found;
                    })
                    .join(", ")
            }
            sx={{
              "& .MuiSelect-select": {
                color: Array.isArray(value) && value.length === 0 ? "#9C8585" : "inherit",
                opacity: 1
              }
            }}
          >
            <MenuItem disabled value="">
              {placeholder}
            </MenuItem>
            {options?.map((option, index) => {
              const val = typeof option === "string" ? option : option.id;
              const label = typeof option === "string" ? option : option.name;
              return (
                <MenuItem key={index} value={val}>
                  <Checkbox
                    checked={Array.isArray(value) && value.includes(val)}
                    sx={{ padding: "0 8px 0 0" }}
                  />
                  {label}
                </MenuItem>
              );
            })}
          </Select>
        )}
      </Box>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default FormField;
