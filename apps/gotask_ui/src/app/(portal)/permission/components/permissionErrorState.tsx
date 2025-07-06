import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";

interface PermissionErrorStateProps {
  message?: string;
  onRetry?: () => void;
  onBack: () => void;
}

const PermissionErrorState: React.FC<PermissionErrorStateProps> = ({
  message = "Error loading permission",
  onRetry,
  onBack
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        p: 3
      }}
    >
      <Paper sx={{ p: 4, textAlign: "center", maxWidth: 400 }}>
        <ErrorIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          {message}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
          <Button variant="outlined" onClick={onBack}>
            Go Back
          </Button>
          {onRetry && (
            <Button variant="contained" onClick={onRetry}>
              Retry
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default PermissionErrorState;
