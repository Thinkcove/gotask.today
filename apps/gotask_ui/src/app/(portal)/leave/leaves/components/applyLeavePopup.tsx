"use client";
import React, { useState, useCallback, useMemo } from "react";
import { Button, Box, Typography, Dialog, DialogContent, DialogTitle, TextField, MenuItem } from "@mui/material";
import moment from "moment-timezone";
import { LEAVE_TYPE } from "../constants/leaveConstants";
import { LeavePayload } from "../interface/leave";
import { createLeave } from "../services/leaveServices";

const ApplyLeavePopup: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<LeavePayload>({
    from_date: moment().format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    leave_type: LEAVE_TYPE.SICK,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setFormData({
      from_date: moment().format("YYYY-MM-DD"),
      to_date: moment().format("YYYY-MM-DD"),
      leave_type: LEAVE_TYPE.SICK,
    });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  useMemo(() => {
    if (open) {
      resetForm();
    }
  }, [open, resetForm]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 

  const validateForm = () => {
  const newErrors: { [key: string]: string } = {};
  if (!formData.from_date) newErrors.from_date = "From Date is required";
  if (!formData.to_date) newErrors.to_date = "To Date is required";
  if (new Date(formData.from_date) > new Date(formData.to_date)) {
    newErrors.to_date = "To Date cannot be earlier than From Date";
  }
  if (!formData.leave_type) newErrors.leave_type = "Leave Type is required";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = useCallback(async (e: React.FormEvent) => {
  e.preventDefault();
  if (isSubmitting || !validateForm()) return;
  setIsSubmitting(true);
  try {
    const response = await createLeave(formData);
    if (response && response.success) {
      onClose();
    } else {
      console.error("Failed to create leave:", response?.message || "Unknown error");
    }
  } catch (error) {
    console.error("Error creating leave:", error);
  } finally {
    setIsSubmitting(false);
  }
}, [formData, isSubmitting, onClose, validateForm]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#741B92" }}>
          Apply Leave
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
          <TextField
            label="From Date"
            type="date"
            value={formData.from_date}
            onChange={(e) => handleInputChange("from_date", e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.from_date}
            helperText={errors.from_date}
          />
          <TextField
            label="To Date"
            type="date"
            value={formData.to_date}
            onChange={(e) => handleInputChange("to_date", e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.to_date}
            helperText={errors.to_date}
          />
          <TextField
            select
            label="Leave Type"
            value={formData.leave_type}
            onChange={(e) => handleInputChange("leave_type", e.target.value as string)}
            fullWidth
            margin="normal"
            error={!!errors.leave_type}
            helperText={errors.leave_type}
          >
            {Object.values(LEAVE_TYPE).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: "30px", textTransform: "none" }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{ borderRadius: "30px", backgroundColor: "#741B92", color: "white", textTransform: "none" }}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyLeavePopup;

