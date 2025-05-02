"use client";
import React, { useState } from "react";
import { IProjectField, Project, PROJECT_STATUS } from "../interfaces/projectInterface";
import { createProject } from "../services/projectAction";
import ProjectInput from "./projectInputs";
import { KeyedMutator } from "swr";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

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
  const transproject =  useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const [formData, setFormData] = useState<IProjectField>(initialFormState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // Validate required fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = transproject("Projecttitle");
    if (!formData.description) newErrors.description = transproject("description");
    if (!formData.status) newErrors.status = transproject("status");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof IProjectField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await createProject(formData);
      await mutate();
      setSnackbar({
        open: true,
        message: transproject("errormessage"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      onClose();
    } catch {
      setSnackbar({
        open: true,
        message: transproject("successmessage"),
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
        title={transproject("createnew")}
      >
        <ProjectInput formData={formData} handleChange={handleChange} errors={errors} />
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
