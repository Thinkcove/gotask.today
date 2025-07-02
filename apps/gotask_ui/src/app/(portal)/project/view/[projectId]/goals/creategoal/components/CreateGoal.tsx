"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useUser } from "@/app/userContext";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import ProjectGoalForm from "../../components/projectGoalForm";
import { createWeeklyGoal } from "../../goalservices/projectGoalAction";
import { useGoalForm } from "../../goalHook/useGoalForm";
import FormHeader from "@/app/(portal)/access/components/FormHeader";
import { useAllProjects } from "@/app/(portal)/task/service/taskAction";

const CreateGoal = () => {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);
  const { projectId } = useParams();
  const projectID = projectId as string;

  const router = useRouter();
  const { user } = useUser();

  const { getAllProjects } = useAllProjects();
  console.log("getAllProjects", getAllProjects);

  // Step 2: Find current project
  const currentProject = getAllProjects?.find(
    (project: { id: string }) => project.id === projectID
  );

  // Step 3: Create options array with only the current project
  const currentProjectOptions = currentProject ? [currentProject] : [];

  console.log("Current project:", currentProject);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    goalData,
    setGoalData,
    errors,
    snackbar,
    rteRef,
    validateForm,
    handleSnackbarClose,
    showSnackbar
  } = useGoalForm(projectID);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const editorContent = rteRef.current?.editor?.getHTML() || goalData.description;
      const payload = {
        projectId: projectID,
        goalTitle: goalData.goalTitle,
        weekStart:
          typeof goalData.weekStart === "string"
            ? goalData.weekStart
            : goalData.weekStart.toISOString(),
        weekEnd:
          typeof goalData.weekEnd === "string" ? goalData.weekEnd : goalData.weekEnd.toISOString(),
        status: goalData.status,
        description: editorContent,
        priority: goalData.priority,
        user_id: user?.id ?? ""
      };

      await createWeeklyGoal(payload);

      showSnackbar(transGoal("savegoal"), SNACKBAR_SEVERITY.SUCCESS);

      // Navigate back to the goal list after successful creation
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      console.error("Error creating weekly goal:", err);
      showSnackbar(transGoal("saveError"), SNACKBAR_SEVERITY.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };
  // In your parent component where you're calling ProjectGoalForm
  const handleProjectChange = (value: string | number | string[] | Date): void => {
    const selectedId = String(value); // Convert to string
    console.log("Selected project ID:", selectedId);

    const selectedProject = getAllProjects?.find((project:any) => project.id === selectedId);
    console.log("Selected project:", selectedProject);

    // Add your logic here - navigate, update state, etc.
  };


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        m: 0,
        p: 0,
        overflow: "hidden"
      }}
    >
      <FormHeader
        isEdit={false}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        showModuleHeader={true}
        projectname={currentProject?.name}
      />

      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <ProjectGoalForm
          rteRef={rteRef}
          goalData={goalData}
          setGoalData={setGoalData}
          errors={errors}
          currentProjectOptions={currentProjectOptions} // Array of projects for dropdown
          currentProject={currentProject} // Current selected project
          handleProjectChange={handleProjectChange}
        />
      </Box>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default CreateGoal;
