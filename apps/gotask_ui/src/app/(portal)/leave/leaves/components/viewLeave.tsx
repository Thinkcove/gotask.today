
import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Box, Button, Grid } from "@mui/material";
import { LeaveEntry } from "../interface/leave";

interface ViewLeavePopupProps {
  open: boolean;
  onClose: () => void;
  leave: LeaveEntry | null;
}

const ViewLeavePopup: React.FC<ViewLeavePopupProps> = ({ open, onClose, leave }) => {
  if (!leave) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#741B92" }}>
          Leave Details
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#666", mb: 1 }}>
                User Name
              </Typography>
              <Typography variant="body1">{leave.user_name}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#666", mb: 1 }}>
                Leave Type
              </Typography>
              <Typography variant="body1">{leave.leave_type}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#666", mb: 1 }}>
                From Date
              </Typography>
              <Typography variant="body1">{formatDate(leave.from_date)}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#666", mb: 1 }}>
                To Date
              </Typography>
              <Typography variant="body1">{formatDate(leave.to_date)}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#666", mb: 1 }}>
                Created Date
              </Typography>
              <Typography variant="body1">{formatDate(leave.createdAt)}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#666", mb: 1 }}>
                Last Updated
              </Typography>
              <Typography variant="body1">{formatDate(leave.updatedAt)}</Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: "30px", textTransform: "none" }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewLeavePopup;
