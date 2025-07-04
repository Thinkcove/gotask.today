
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box } from "@mui/material";
import { LeaveEntry } from "../interface/leaveInterface";



interface DeleteConfirmationPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leave: LeaveEntry | null;
  isDeleting: boolean;
  transleave: (key: string) => string;
}

const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({
  open,
  onClose,
  onConfirm,
  leave,
  isDeleting,
  transleave
}) => {
  if (!leave) return null;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#741B92" }}>
          {transleave("deletetitle")}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 1 }}>
          <Typography variant="body1" sx={{ mb: 2 , fontWeight: "medium"}}>
            {transleave("deleteconfirm")}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", mb:1 }}>
            <strong>{transleave("user")}</strong> {leave.user_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666",mb:1 }}>
            <strong>{transleave("leavetype:")}</strong> {leave.leave_type}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 2,justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isDeleting}
            sx={{
            borderRadius: "30px",
            color: "black",
            border: "2px solid #741B92",
            px: 2,
            textTransform: "none",
            "&:hover": {
              borderColor: "#5e156f",
            },
          }}
        >
          {transleave("cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={isDeleting}
          sx={{ 
            borderRadius: "30px", 
            backgroundColor: "#741B92", 
            color: "white", 
            px: 2,
            textTransform: "none",
             fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#5e156f",
            },
          }}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationPopup;

