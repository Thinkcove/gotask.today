import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogProps
} from "@mui/material";

interface CommonDialogProps extends DialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
}

const CommonDialog: React.FC<CommonDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  children,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  ...dialogProps
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" {...dialogProps}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {cancelLabel}
        </Button>
        {onSubmit && (
          <Button onClick={onSubmit} color="primary">
            {submitLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CommonDialog;
