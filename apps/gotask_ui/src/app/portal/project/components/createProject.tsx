"use client";
import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { IProjectField, PROJECT_STATUS } from "../interfaces/projectInterface";
import { createProject } from "../services/projectAction";
import ProjectInput from "./projectInputs";

interface CreateProjectProps {
  open: boolean;
  onClose: () => void;
}

const initialFormState: IProjectField = {
  name: "",
  description: "",
  status: PROJECT_STATUS.TO_DO,
  organization_id: ""
};

const CreateProject = ({ open, onClose }: CreateProjectProps) => {
  const [formData, setFormData] = useState<IProjectField>(initialFormState);

  // Reset formData when modal opens
  const handleDialogEnter = () => {
    setFormData(initialFormState);
  };

  const handleChange = (field: keyof IProjectField, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createProject(formData);
      console.log("Project created!");
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Project</DialogTitle>
      <DialogContent>
        <ProjectInput formData={formData} handleChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProject;
