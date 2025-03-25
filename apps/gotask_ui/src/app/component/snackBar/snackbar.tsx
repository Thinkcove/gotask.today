import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { SNACKBAR_DURATION } from "../../common/constants/snackbar";
import { getSeverityStyles } from "./getSeverityStyle";

interface SnackbarProps {
  message: string;
  severity?: "success" | "error" | "warning" | "info";
  open: boolean;
  onClose: () => void;
}

const CustomSnackbar: React.FC<SnackbarProps> = ({
  message,
  severity = "info",
  open,
  onClose,
}) => {
  const severityStyles = getSeverityStyles({
    error: severity === "error",
    warning: severity === "warning",
    success: severity === "success",
    info: severity === "info",
  });

  return (
    <Snackbar
      open={open}
      autoHideDuration={SNACKBAR_DURATION}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          backgroundColor: severityStyles.bgColor,
          color: "white",
          width: "374px",
        }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
