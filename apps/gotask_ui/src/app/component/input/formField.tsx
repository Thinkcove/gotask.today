import React, { useState } from "react";
import {
  TextField,
  FormControl,
  Box,
  Typography,
  FormHelperText,
  InputAdornment,
  Checkbox,
  Autocomplete,
  IconButton,
  TextFieldProps
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  CalendarMonth,
  Edit,
  Visibility,
  VisibilityOff,
  Send as SendIcon
} from "@mui/icons-material";
import { SxProps, Theme } from "@mui/material/styles";

export interface SelectOption {
  name: string;
  id: string;
}

interface FormFieldProps {
  label: string;
  type: "text" | "select" | "date" | "multiselect";
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[] | string[];
  value?: string | number | Date | string[];
  onChange?: (value: string | number | Date | string[]) => void;
  onSend?: () => void;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  height?: number;
  onFocus?: () => void;
  inputType?: string;
  inputProps?: TextFieldProps["InputProps"];
  sx?: SxProps<Theme>;
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
  onSend,
  disabled = false,
  multiline = false,
  height,
  onFocus,
  inputType,
  inputProps,
  sx
}) => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const normalizedOptions: SelectOption[] = (options || []).map((opt) =>
    typeof opt === "string" ? { id: opt, name: opt } : opt
  );

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
          "&:focus-within": { borderColor: "#741B92", backgroundColor: "#fff" },
          ...(sx || {})
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
            type={passwordVisible ? "text" : "password"}
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && onSend) {
                e.preventDefault();
                onSend();
              }
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
                  {onSend && (
                    <IconButton onClick={onSend} disabled={disabled || !value}>
                      <SendIcon sx={{ color: value && !disabled ? "#741B92" : "#9C8585" }} />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
              ...inputProps
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
                if (inputType === "tel") {
                  val = val.replace(/[^\d\s()+-]/g, "");
                }
                onChange?.(val);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && onSend) {
                  e.preventDefault();
                  onSend();
                }
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Edit sx={{ color: "#9C8585" }} />
                  </InputAdornment>
                ),
                endAdornment: onSend && (
                  <InputAdornment position="end">
                    <IconButton onClick={onSend} disabled={disabled || !value}>
                      <SendIcon sx={{ color: value && !disabled ? "#741B92" : "#9C8585" }} />
                    </IconButton>
                  </InputAdornment>
                ),
                ...inputProps
              }}
            />
          )
        )}

        {type === "select" && (
          <Autocomplete
            options={normalizedOptions}
            getOptionLabel={(option) => option.name}
            value={normalizedOptions.find((opt) => opt.id === value) || null}
            onChange={(_, newValue) => {
              onChange?.(newValue?.id || "");
            }}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                variant="standard"
                error={!!error}
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  ...inputProps
                }}
                sx={{
                  "& input": {
                    color: value ? "inherit" : "#9C8585"
                  }
                }}
              />
            )}
          />
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
                  ),
                  ...inputProps
                }}
              />
            }
          />
        )}

        {type === "multiselect" && (
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={normalizedOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={
              Array.isArray(value) ? normalizedOptions.filter((opt) => value.includes(opt.id)) : []
            }
            onChange={(_, newValue) => {
              onChange?.(newValue.map((item) => item.id));
            }}
            disabled={disabled}
            filterSelectedOptions
            renderOption={(props, option, { selected }) => {
              const { key, ...rest } = props;
              return (
                <li key={key} {...rest}>
                  <Checkbox checked={selected} sx={{ marginRight: 1 }} />
                  {option.name}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                variant="standard"
                error={!!error}
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  ...inputProps
                }}
                sx={{
                  "& input": {
                    color: Array.isArray(value) && value.length === 0 ? "#9C8585" : "inherit"
                  }
                }}
              />
            )}
          />
        )}
      </Box>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default FormField;
