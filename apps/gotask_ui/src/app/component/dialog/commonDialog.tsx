import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogProps,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CommonDialogProps extends DialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  submitColor?: string; // New prop for dynamic color
}

const CommonDialog: React.FC<CommonDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  children,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  submitColor,
  ...dialogProps
}) => {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        // prevent closing when clicking outside or pressing ESC
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      keepMounted
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
          boxShadow: "0px 15px 30px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0",
          position: "relative" // Needed for close button positioning
        }
      }}
      {...dialogProps}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "grey.600"
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Header */}
      <DialogTitle sx={{ background: "#f5f7fa", py: 2, px: 3 }}>{title}</DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 2 }}>{children}</DialogContent>

      {/* Footer */}
      <DialogActions sx={{ justifyContent: "flex-end", gap: 1, p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{
            textTransform: "none",
            borderRadius: 3,
            px: 3,
            py: 1.2
          }}
        >
          {cancelLabel}
        </Button>
        {onSubmit && (
          <Button
            onClick={onSubmit}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 3,
              px: 3,
              py: 1.2,
              backgroundColor: submitColor || "#741B92",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                backgroundColor: submitColor ? submitColor : "#5a1472",
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.25)"
              }
            }}
          >
            {submitLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CommonDialog;
