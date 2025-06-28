"use client";

import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import CommonDialog from "@/app/component/dialog/commonDialog";
import ProjectInput from "../../components/projectInputs";
import { updateProject } from "../../services/projectAction";
import { KeyedMutator } from "swr";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { IProjectField, Project } from "../../interfaces/projectInterface";
import { RichTextEditorRef } from "mui-tiptap";

interface EditProjectProps {
  data: IProjectField;
  open: boolean;
  onClose: () => void;
  projectID: string;
  mutate: KeyedMutator<Project>;
}

const EditProject: React.FC<EditProjectProps> = ({ data, open, onClose, projectID, mutate }) => {
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const rteRef = useRef<RichTextEditorRef>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [formData, setFormData] = useState<IProjectField>(() => ({
    name: data?.name || "",
    description: data?.description || "",
    status: data?.status || "",
    organization_id: data?.organization_id || ""
  }));
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

  const handleChange = (name: keyof IProjectField, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    const html = rteRef.current?.editor?.getHTML?.() || formData.description;
    handleChange("description", html);

    if (!validateForm()) return;

    try {
      const updatedFields: Partial<IProjectField> = {};
      if (formData.name !== data.name) updatedFields.name = formData.name;
      if (formData.description !== data.description) updatedFields.description = html;
      if (formData.status !== data.status) updatedFields.status = formData.status;
      if (formData.organization_id !== data.organization_id)
        updatedFields.organization_id = formData.organization_id;

      if (Object.keys(updatedFields).length === 0) {
        setSnackbar({
          open: true,
          message: transproject("noupdates"),
          severity: SNACKBAR_SEVERITY.INFO
        });
        return;
      }

      await updateProject(projectID, formData);
      await mutate();
      setSnackbar({
        open: true,
        message: transproject("updatesuccess"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      onClose();
    } catch {
      setSnackbar({
        open: true,
        message: transproject("updateerror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        margin: "0 auto",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <CommonDialog
        open={open}
        onClose={onClose}
        onSubmit={handleSubmit}
        title={transproject("edittitle")}
      >
        <ProjectInput
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          readOnlyFields={["name"]}
          rteRef={rteRef}
        />
      </CommonDialog>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default EditProject;
