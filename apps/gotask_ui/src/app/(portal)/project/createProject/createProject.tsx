"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IProjectField, PROJECT_STATUS, Project } from "../interfaces/projectInterface";
import { createProject } from "../services/projectAction";
import ProjectInput from "../components/projectInputs";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { KeyedMutator } from "swr";
import { User } from "../../user/interfaces/userInterface";
import FormHeader from "@/app/component/header/formHeader";

interface CreateProjectProps {
  mutate?: KeyedMutator<Project>;
}

const initialFormState: IProjectField = {
  name: "",
  description: "",
  status: PROJECT_STATUS.TO_DO,
  organization_id: ""
};

const CreateProject = ({ mutate }: CreateProjectProps) => {
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const router = useRouter();

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
    if (!validateForm(formData)) return;

    try {
      await createProject(formData);
      if (mutate) await mutate();
      setSnackbar({
        open: true,
        message: transproject("successmessage"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      router.push("/project");
    } catch {
      setSnackbar({
        open: true,
        message: transproject("errormessage"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    router.back();
  };
  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", display: "flex", flexDirection: "column" }}>
      {/* Sticky Header */}
      <FormHeader
        isEdit={false} 
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        cancel={transproject("cancelproject")}
        create={transproject("submitproject")}
        createHeading={transproject("createnew")}
      />
      {/* Input Form */}
      <Box
        sx={{
          px: 2,
          pb: 2,
          maxHeight: "calc(100vh - 150px)",
          overflowY: "auto"
        }}
      >
        <ProjectInput
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          readOnlyFields={["status"]}
        />
      </Box>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default CreateProject;
