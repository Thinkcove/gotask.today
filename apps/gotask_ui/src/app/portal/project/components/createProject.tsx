"use client";
import React, { useState } from "react";
import { IProjectField, Project, PROJECT_STATUS } from "../interfaces/projectInterface";
import { createProject } from "../services/projectAction";
import ProjectInput from "./projectInputs";
import { KeyedMutator } from "swr";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import CommonDialog from "@/app/component/dialog/commonDialog";

interface CreateProjectProps {
  open: boolean;
  onClose: () => void;
  mutate: KeyedMutator<Project>;
}

const initialFormState: IProjectField = {
  name: "",
  description: "",
  status: PROJECT_STATUS.TO_DO,
  organization_id: ""
};

const CreateProject = ({ open, onClose, mutate }: CreateProjectProps) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [formData, setFormData] = useState<IProjectField>(initialFormState);

  const handleChange = (field: keyof IProjectField, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createProject(formData);
      await mutate();
      setSnackbar({
        open: true,
        message: "Project created successfully!",
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error while creating project",
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  return (
    <>
      <CommonDialog
        open={open}
        onClose={onClose}
        onSubmit={handleSubmit}
        title="Create New Project"
      >
        <ProjectInput formData={formData} handleChange={handleChange} />
      </CommonDialog>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default CreateProject;
