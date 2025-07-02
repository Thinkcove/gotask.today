"use client";

import React from "react";
import { Dialog, Box, IconButton, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormField from "@/app/component/input/formField";
import { Template } from "@/app/(portal)/kpi/service/templateInterface";

interface TemplateAssignDialogProps {
  open: boolean;
  onClose: () => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (val: string) => void;
  templates: Template[];
  onAssign: () => void;
  transkpi: (key: string) => string;
}

const TemplateAssignDialog: React.FC<TemplateAssignDialogProps> = ({
  open,
  onClose,
  selectedTemplateId,
  setSelectedTemplateId,
  templates,
  onAssign,
  transkpi
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          p: 2,
          borderRadius: 2,
          width: "400px",
          maxHeight: "300px"
        }
      }}
    >
      {/* Close Icon */}
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 2,
            right: 2
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography variant="h6" mb={2} sx={{ color: "#741B92" }}>
        {transkpi("selecttemplate")}
      </Typography>

      <FormField
        label={transkpi("assigntemplate")}
        type="select"
        placeholder={transkpi("entertemplate")}
        options={templates.map((template) => ({
          id: template.id,
          name: template.title
        }))}
        value={selectedTemplateId}
        onChange={(val) => setSelectedTemplateId(String(val))}
      />

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button variant="outlined" onClick={onClose} sx={{ mr: 2, borderRadius: "30px" }}>
          {transkpi("cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={onAssign}
          sx={{
            backgroundColor: "#741B92",
            color: "white",
            fontWeight: "bold",
            borderRadius: "30px"
          }}
        >
          {transkpi("assign")}
        </Button>
      </Box>
    </Dialog>
  );
};

export default TemplateAssignDialog;
