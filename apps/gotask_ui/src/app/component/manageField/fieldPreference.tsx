import React, { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Stack,
  Popover,
  Link
} from "@mui/material";
interface FieldPreferenceProps {
  allFields: string[];
  excludedFields?: string[];
  onSave: (excluded: string[]) => void;
}
// FieldPreference Component
const FieldPreference: React.FC<FieldPreferenceProps> = ({
  allFields,
  excludedFields = [],
  onSave
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tempExcluded, setTempExcluded] = useState<string[]>(excludedFields);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setTempExcluded(excludedFields); // reset temp on open
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleField = (field: string) => {
    setTempExcluded((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleSelectAll = () => {
    setTempExcluded([]); // none excluded
  };

  const handleClearAll = () => {
    setTempExcluded([...allFields]); // all excluded
  };

  const handleApply = () => {
    onSave(tempExcluded);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button variant="outlined" onClick={handleClick}>
        Field Preferences
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: 250 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Fields to Hide
          </Typography>

          <Stack spacing={1}>
            {allFields.map((field) => (
              <FormControlLabel
                key={field}
                control={
                  <Checkbox
                    checked={!tempExcluded.includes(field)}
                    onChange={() => toggleField(field)}
                  />
                }
                label={field}
              />
            ))}
          </Stack>
          <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
            <Link component="button" variant="body2" onClick={handleSelectAll}>
              Select All
            </Link>
            <Link component="button" variant="body2" onClick={handleClearAll}>
              Clear All
            </Link>
          </Box>
          <Box sx={{ mt: 2, width: "100%" }}>
            <Button size="small" variant="contained" onClick={handleApply} fullWidth>
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default FieldPreference;
