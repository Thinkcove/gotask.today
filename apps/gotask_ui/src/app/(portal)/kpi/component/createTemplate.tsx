"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel
} from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { Template } from "../service/templateInterface";
import { createTemplate } from "../service/templateAction";
import {
  KPI_FREQUENCY,
  MEASUREMENT_CRITERIA_OPTIONS,
  STATUS_OPTIONS
} from "@/app/common/constants/kpi";
import FormField from "@/app/component/input/formField";

interface CreateTemplateProps {
  open: boolean;
  onClose: () => void;
  mutate: (
    data?: Template[] | Promise<Template[]> | null,
    options?: { revalidate: boolean }
  ) => void;
}

const CreateTemplate: React.FC<CreateTemplateProps> = ({ open, onClose, mutate }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [weightage, setWeightage] = useState<string>("");
  const [frequency, setFrequency] = useState("");

  const handleCreate = async () => {
    if (!name || !weightage || !frequency) {
      setError(transkpi("validationerror"));
      return;
    }

    const newTemplate: Partial<Template> = {
      name,
      description: description || undefined,
      weightage,
      frequency,
      status
    };

    try {
      const result = await createTemplate(newTemplate);
      console.log("createTemplate Result:", result);
      if (!result.success) {
        setError(result.message);
        return;
      }
      mutate();
      onClose();
      setName("");
      setDescription("");
      setWeightage("");
      setFrequency("");
      setStatus("");
      setError("");
    } catch (err: any) {
      console.error("Error in handleCreate:", err);
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{transkpi("createnewtemplate")}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          <FormField
            label={transkpi("name")}
            type="text"
            required
            placeholder={transkpi("entername")}
            value={name}
            onChange={(val) => setName(val as string)}
            error={!name && error ? transkpi("validationerror") : ""}
          />

          <FormField
            label={transkpi("description")}
            type="text"
            placeholder={transkpi("enterdescription")}
            multiline
            value={description}
            onChange={(val) => setDescription(val as string)}
          />

          <FormField
            label={transkpi("frequency")}
            type="select"
            options={Object.values(KPI_FREQUENCY)}
            value={frequency}
            onChange={(val) => setFrequency(val as string)}
            error={!frequency && error ? transkpi("validationerror") : ""}
          />

          <FormField
            label={transkpi("status")}
            type="select"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(val) => setStatus(val as string)}
            error={!status && error ? transkpi("validationerror") : ""}
          />

          {/* Keep the radio button group as-is for weightage */}
          <FormControl component="fieldset">
            <FormLabel component="legend">{transkpi("weightage")}</FormLabel>
            <RadioGroup row value={weightage} onChange={(e) => setWeightage(e.target.value)}>
              {MEASUREMENT_CRITERIA_OPTIONS.map((value) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={value.toString()}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {error && (
            <Typography color="error.main" fontSize="0.875rem">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {transkpi("cancel")}
        </Button>
        <Button onClick={handleCreate} color="primary" variant="contained">
          {transkpi("create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTemplate;
