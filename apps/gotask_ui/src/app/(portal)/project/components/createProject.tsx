"use client";

import React, { useRef, useState } from "react";
import { IProjectField, Project, PROJECT_STATUS } from "../interfaces/projectInterface";
import { createProject } from "../services/projectAction";
import ProjectInput from "./projectInputs";
import { KeyedMutator } from "swr";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { RichTextEditorRef } from "mui-tiptap";

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

const CreateProject: React.FC<CreateProjectProps> = ({ open, onClose, mutate }) => {
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const rteRef = useRef<RichTextEditorRef>(null);
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
    if (!formData.organization_id) newErrors.organization_id = transproject("organization");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof IProjectField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const html = rteRef.current?.editor?.getHTML?.() || formData.description;
    handleChange("description", html);

    if (!validateForm()) return;

    try {
      await createProject({ ...formData, description: html });
      await mutate();
      setSnackbar({
        open: true,
        message: transproject("successmessage"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      handleClose();
    } catch {
      setSnackbar({
        open: true,
        message: transproject("errormessage"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setErrors({});
    onClose();
  };

  return (
    <>
      <CommonDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title={transproject("createnew")}
      >
        <ProjectInput
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          readOnlyFields={["status"]}
          rteRef={rteRef}
        />
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
