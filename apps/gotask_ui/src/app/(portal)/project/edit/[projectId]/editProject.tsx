"use client";
import React, { useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ProjectInput from "../../components/projectInputs";
import { updateProject } from "../../services/projectAction";
import { KeyedMutator } from "swr";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { IProjectField, Project, PROJECT_STATUS } from "../../interfaces/projectInterface";
import { ArrowBack } from "@mui/icons-material";

interface EditProjectProps {
  data: IProjectField;
  projectID: string;
  mutate: KeyedMutator<Project>;
}

const EditProject: React.FC<EditProjectProps> = ({ data, projectID, mutate }) => {
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const router = useRouter();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const [formData, setFormData] = useState<IProjectField>(() => ({
    name: data?.name || "",
    description: data?.description || "",
    status: data?.status || PROJECT_STATUS.TO_DO,
    organization_id: data?.organization_id || ""
  }));

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = transproject("Projecttitle");
    if (!formData.description) newErrors.description = transproject("description");
    if (!formData.status) newErrors.status = transproject("status");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await updateProject(projectID, formData);
      await mutate();
      setSnackbar({
        open: true,
        message: transproject("updatesuccess"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      setTimeout(() => {
        router.push("/project"); // redirect to project list
      }, 1500);
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
        maxWidth: "1300px",
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}
    >
      {/* Sticky Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="primary" onClick={() => router.back()}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
            {transproject("edittitle")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={() => router.back()} sx={{ borderRadius: 30 }}>
            {transproject("cancelproject")}
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ borderRadius: 30, backgroundColor: "#741B92", fontWeight: "bold" }}
          >
            {transproject("submitproject")}
          </Button>
        </Box>
      </Box>

      {/* Form Section */}
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
          readOnlyFields={[]}
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

export default EditProject;
