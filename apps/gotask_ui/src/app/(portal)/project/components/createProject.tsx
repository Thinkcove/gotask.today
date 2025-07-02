"use client";
import React, { useState, useRef } from "react";
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
import { User } from "../../user/interfaces/userInterface";

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
  const rteRef = useRef<RichTextEditorRef>(null);
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const [formData, setFormData] = useState<IProjectField>(initialFormState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const handleChange = (name: string, value: string | Date | Project[] | User[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value instanceof Date ? value.toISOString().split("T")[0] : value
    }));
  };

  const validateForm = (updatedForm: IProjectField) => {
    const newErrors: { [key: string]: string } = {};
    if (!updatedForm.name) newErrors.name = transproject("Projecttitle");
    if (!updatedForm.description) newErrors.description = transproject("description");
    if (!updatedForm.status) newErrors.status = transproject("status");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const html = rteRef.current?.editor?.getHTML?.() || "";
    const updatedForm = { ...formData, description: html };

    if (!validateForm(updatedForm)) return;

    try {
      await createProject(updatedForm);
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
