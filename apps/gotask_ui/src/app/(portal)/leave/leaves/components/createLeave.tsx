import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ILeave } from "../interface/leave";
import { LEAVE_TYPES } from "../constants/leaveConstants";
import { createLeave } from "../services/leaveServices";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateLeave: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Partial<ILeave>>({
    leave_type: undefined,
    from_date: '',
    to_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (!formData.leave_type || !formData.from_date || !formData.to_date) {
      setError('All fields are required');
      return;
    }

    if (new Date(formData.from_date) > new Date(formData.to_date)) {
      setError('From date cannot be later than To date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await createLeave(formData as ILeave);
      if (result.success) {
        onSuccess?.();
        handleClose();
      } else {
        setError(result.message || 'Failed to create leave request');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      leave_type: undefined,
      from_date: '',
      to_date: ''
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Leave Request</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <FormControl fullWidth>
            <InputLabel>Leave Type</InputLabel>
            <Select
              value={formData.leave_type || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, leave_type: e.target.value as "sick" | "personal" }))}
              label="Leave Type"
            >
              {LEAVE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="From Date"
              value={formData.from_date ? new Date(formData.from_date) : null}
              onChange={(date) => setFormData(prev => ({ 
                ...prev, 
                from_date: date ? date.toISOString().split('T')[0] : '' 
              }))}
              slotProps={{ textField: { fullWidth: true } }}
            />
            
            <DatePicker
              label="To Date"
              value={formData.to_date ? new Date(formData.to_date) : null}
              onChange={(date) => setFormData(prev => ({ 
                ...prev, 
                to_date: date ? date.toISOString().split('T')[0] : '' 
              }))}
              slotProps={{ textField: { fullWidth: true } }}
              minDate={formData.from_date ? new Date(formData.from_date) : undefined}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLeave;