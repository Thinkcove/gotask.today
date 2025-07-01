import React, { useState, useCallback, useRef } from "react";
import { Button, Box, Typography, Dialog, DialogTitle, DialogContent, TextField, MenuItem } from "@mui/material";
import moment from "moment-timezone";
import { LEAVE_TYPE } from "../constants/leaveConstants";
import { LeaveEntry, LeavePayload } from "../interface/leave";

interface EditLeavePopupProps {
  open: boolean;
  onClose: () => void;
  leave: LeaveEntry | null;
  onUpdate: (id: string, data: LeavePayload) => Promise<void>;
}

const EditLeavePopup: React.FC<EditLeavePopupProps> = ({ open, onClose, leave, onUpdate }) => {
  // Initialize formData with default values or based on leave prop when available
  const getInitialFormData = (): LeavePayload => {
    if (leave) {
      return {
        from_date: moment(leave.from_date).format("YYYY-MM-DD"),
        to_date: moment(leave.to_date).format("YYYY-MM-DD"),
        leave_type: leave.leave_type,
      };
    }
    return {
      from_date: "",
      to_date: "",
      leave_type: LEAVE_TYPE.SICK,
    };
  };

  const [formData, setFormData] = useState<LeavePayload>(getInitialFormData());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initRef = useRef<{ open: boolean; leaveId: string | null }>({ open: false, leaveId: null });

  // Reset form when dialog opens or leave changes
  const resetForm = () => {
    setFormData(getInitialFormData());
    setErrors({});
    setIsSubmitting(false);
  };

  // Check if reset is needed based on dialog open state or leave ID change
  if (open && leave && (initRef.current.open !== open || initRef.current.leaveId !== leave.id)) {
    resetForm();
    initRef.current = { open, leaveId: leave.id };
  }

  // Reset initRef when dialog closes
  if (!open && initRef.current.open) {
    initRef.current = { open: false, leaveId: null };
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 const handleSubmit = useCallback(
  async (e: React.FormEvent) => {
    e.preventDefault();

    const validateForm = () => {
      const newErrors: { [key: string]: string } = {};
      if (!formData.from_date) newErrors.from_date = "From Date is required";
      if (!formData.to_date) newErrors.to_date = "To Date is required";
      if (formData.from_date && formData.to_date && new Date(formData.from_date) > new Date(formData.to_date)) {
        newErrors.to_date = "To Date cannot be earlier than From Date";
      }
      if (!formData.leave_type) newErrors.leave_type = "Leave Type is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    if (isSubmitting || !validateForm() || !leave) return;

    setIsSubmitting(true);

    try {
      await onUpdate(leave.id, formData);
      onClose();
    } catch (error) {
      console.error("Error updating leave:", error);
    } finally {
      setIsSubmitting(false);
    }
  },
  [formData, isSubmitting, leave, onUpdate, onClose]
);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#741B92" }}>
          Edit Leave
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
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeavePopup;