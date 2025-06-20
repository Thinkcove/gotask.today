"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { Template } from "../service/templateInterface";
import { createTemplate } from "../service/templateAction";


interface CreateTemplateProps {
  open: boolean;
  onClose: () => void;
  mutate: () => void;
}

const CreateTemplate: React.FC<CreateTemplateProps> = ({ open, onClose, mutate }) => {
  const transTemplate = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [weightage, setWeightage] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name || !weightage || isNaN(Number(weightage)) || Number(weightage) < 0 || Number(weightage) > 100) {
      setError(transTemplate("validationerror"));
      return;
    }

    const newTemplate: Partial<Template> = {
      name,
      description: description || undefined,
      weightage: Number(weightage),
    };

    try {
      await createTemplate(newTemplate);
      mutate(); // Refresh template list
      onClose();
      setName("");
      setDescription("");
      setWeightage("");
      setError("");
    } catch (err) {
      setError(transTemplate("createerror"));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{transTemplate("createnewtemplate")}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label={transTemplate("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label={transTemplate("description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label={transTemplate("weightage")}
            value={weightage}
            onChange={(e) => setWeightage(e.target.value)}
            fullWidth
            type="number"
            required
            inputProps={{ min: 0, max: 100 }}
          />
          {error && (
            <Box color="error.main" fontSize="0.875rem">
              {error}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {transTemplate("cancel")}
        </Button>
        <Button onClick={handleCreate} color="primary" variant="contained">
          {transTemplate("create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTemplate;