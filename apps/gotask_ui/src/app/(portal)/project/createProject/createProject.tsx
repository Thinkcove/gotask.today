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

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", display: "flex", flexDirection: "column" }}>
      {/* Sticky Header */}
      <Box sx={{ position: "sticky", top: 0, px: 2, py: 2, zIndex: 1000, backgroundColor: "#fff" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
            {transproject("createnew")}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "30px",
                color: "black",
                border: "2px solid #741B92",
                px: 2,
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" }
              }}
              onClick={() => router.back()}
            >
              {transproject("cancelproject")}
            </Button>

            <Button
              variant="contained"
              sx={{
                borderRadius: "30px",
                backgroundColor: "#741B92",
                color: "white",
                px: 2,
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "rgb(202, 187, 201)"
                }
              }}
              onClick={handleSubmit}
            >
              {transproject("submitproject")}
            </Button>
          </Box>
        </Box>
      </Box>

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
