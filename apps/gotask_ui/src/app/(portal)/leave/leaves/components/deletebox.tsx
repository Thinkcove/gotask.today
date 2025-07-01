
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box } from "@mui/material";
import { LeaveEntry } from "../interface/leave";

interface DeleteConfirmationPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leave: LeaveEntry | null;
  isDeleting: boolean;
}

const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({
  open,
  onClose,
  onConfirm,
  leave,
  isDeleting
}) => {
  if (!leave) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#d32f2f" }}>
          Delete Leave Request
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 1 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this leave request?
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            <strong>User:</strong> {leave.user_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            <strong>Leave Type:</strong> {leave.leave_type}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            <strong>Duration:</strong> {leave.from_date} to {leave.to_date}
          </Typography>
          <Typography variant="body2" sx={{ color: "#d32f2f", mt: 2, fontStyle: "italic" }}>
            This action cannot be undone.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ borderRadius: "30px", textTransform: "none" }}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={isDeleting}
          sx={{ 
            borderRadius: "30px", 
            backgroundColor: "#d32f2f", 
            color: "white", 
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#b71c1c"
            }
          }}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationPopup;
