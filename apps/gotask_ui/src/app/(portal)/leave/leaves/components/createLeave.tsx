import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
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
  trans: (key: string) => string;
}

const CreateLeave: React.FC<Props> = ({ open, onClose, onSuccess, trans }) => {
  const [formData, setFormData] = useState<Partial<ILeave>>({
    leave_type: '',
    from_date: '',
    to_date: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (!formData.leave_type || !formData.from_date || !formData.to_date || !formData.reason) {
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
      leave_type: '',
      from_date: '',
      to_date: '',
      reason: ''
    });
    setError('');
    onClose();
  };

  const formatLeaveType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{trans("createLeaveRequest")}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <FormControl fullWidth>
            <InputLabel>{trans("leaveType")}</InputLabel>
            <Select
              value={formData.leave_type}
              onChange={(e) => setFormData(prev => ({ ...prev, leave_type: e.target.value }))}
              label={trans("leaveType")}
            >
              {LEAVE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {formatLeaveType(type)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={trans("fromDate")}
              value={formData.from_date ? new Date(formData.from_date) : null}
              onChange={(date) => setFormData(prev => ({ 
                ...prev, 
                from_date: date ? date.toISOString().split('T')[0] : '' 
              }))}
              slotProps={{ textField: { fullWidth: true } }}
            />
            
            <DatePicker
              label={trans("toDate")}
              value={formData.to_date ? new Date(formData.to_date) : null}
              onChange={(date) => setFormData(prev => ({ 
                ...prev, 
                to_date: date ? date.toISOString().split('T')[0] : '' 
              }))}
              slotProps={{ textField: { fullWidth: true } }}
              minDate={formData.from_date ? new Date(formData.from_date) : undefined}
            />
          </LocalizationProvider>

          <TextField
            label={trans("reason")}
            multiline
            rows={4}
            value={formData.reason}
            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {trans("cancel")}
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? trans("creating") : trans("create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLeave;