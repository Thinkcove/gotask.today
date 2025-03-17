"use client";
import React from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  Box,
  Typography,
  FormHelperText,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FormFieldProps {
  label: string;
  type: "text" | "select" | "date";
  required?: boolean;
  placeholder?: string;
  options?: string[]; // Only for select type
  value: string | number | Date;
  onChange: (value: string | number | Date) => void;
  error?: string;
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
}) => {
  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      {type === "text" && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {label}
          </Typography>
          <TextField
            variant="standard"
            required={required}
            placeholder={placeholder}
            error={!!error}
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
            InputProps={{
              sx: {
                "& .MuiInputBase-input::placeholder": {
                  color: "#9C8585",
                  opacity: 1,
                },
              },
            }}
          />
          {error && <FormHelperText>{error}</FormHelperText>}
        </Box>
      )}

      {type === "select" && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {label}
          </Typography>
          <Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            displayEmpty
            variant="standard"
            fullWidth
            error={!!error}
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography sx={{ color: "#9C8585", opacity: 1 }}>
                    {placeholder}
                  </Typography>
                );
              }
              return typeof selected === "string"
                ? selected
                : selected.toString();
            }}
          >
            <MenuItem value="" disabled sx={{ color: "#9C8585", opacity: 1 }}>
              {placeholder}
            </MenuItem>
            {options?.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error}</FormHelperText>}
        </Box>
      )}

      {type === "date" && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {label}
          </Typography>
          <DatePicker
            selected={value ? new Date(value) : null}
            onChange={(date) =>
              onChange(date ? date.toISOString().split("T")[0] : "")
            }
            dateFormat="MM/dd/yyyy"
            customInput={
              <TextField
                variant="standard"
                fullWidth
                placeholder={placeholder}
                error={!!error}
              />
            }
          />
          {error && <FormHelperText>{error}</FormHelperText>}
        </Box>
      )}
    </FormControl>
  );
};

export default FormField;
