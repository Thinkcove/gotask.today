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
import ModuleHeader from "@/app/component/header/moduleHeader";

const CreateGoal = () => {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);
  const { projectId } = useParams();
  const projectID = projectId as string;

  const router = useRouter();
  const { user } = useUser();

  const { getAllProjects } = useAllProjects();
  const currentProject = getAllProjects?.find(
    (project: { id: string }) => project.id === projectID
  );

  const currentProjectOptions = currentProject ? [currentProject] : [];

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

  return (
    <>
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
        <ModuleHeader name={currentProject?.name} />

        <FormHeader
          isEdit={false}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          edit={transGoal("editgoal")}
          create={transGoal("creategoal")}
          cancle={transGoal("cancel")}
          update={transGoal("update")}
          showhistory={transGoal("showhistory")}
        />

        <ProjectGoalForm
          rteRef={rteRef}
          goalData={goalData}
          setGoalData={setGoalData}
          errors={errors}
          currentProjectOptions={currentProjectOptions}
          currentProject={currentProject}
        />

        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={handleSnackbarClose}
        />
      </Box>
    </>
  );
};

export default CreateGoal;
