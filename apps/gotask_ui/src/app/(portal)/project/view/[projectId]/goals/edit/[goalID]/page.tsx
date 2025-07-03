"use client";
import React, { useState, useMemo } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useUser } from "@/app/userContext";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import useSWR, { mutate } from "swr";
import { fetcherUserList } from "@/app/(portal)/user/services/userAction";
import { fetchGoalData, updateWeeklyGoal } from "../../goalservices/projectGoalAction";
import ProjectGoalForm from "../../components/projectGoalForm";
import HistoryDrawer from "../../components/history";
import { useGoalForm } from "../../goalHook/useGoalForm";
import FormHeader from "../../../../../../access/components/FormHeader";
import { useAllProjects } from "@/app/(portal)/task/service/taskAction";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { GoalUpdateData, UpdateHistoryItem, User } from "../../interface/projectGoal";

const EditGoalPage = () => {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);
  const router = useRouter();

  const params = useParams();
  const projectId = params.projectId;
  const goalId = params.goalID;

  const { user } = useUser();

  const projectID = projectId as string;
  const goalID = goalId as string;
  const { getAllProjects } = useAllProjects();
  const currentProject = getAllProjects?.find(
    (project: { id: string }) => project.id === projectID
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState(false);

  const { data: users } = useSWR("fetch-user", fetcherUserList);

  const { data: fetchedGoalData, isLoading: isLoadingGoal } = useSWR(
    goalID ? `goal-${goalID}` : null,
    () => fetchGoalData(goalID),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 1
    }
  );

  const {
    goalData,
    setGoalData,
    errors,
    snackbar,
    rteRef,
    validateForm,
    handleSnackbarClose,
    showSnackbar
  } = useGoalForm(projectID, fetchedGoalData);

  const projectGoalHistory = useMemo(() => {
    return fetchedGoalData?.updateHistory ? { updateHistory: fetchedGoalData.updateHistory } : null;
  }, [fetchedGoalData?.updateHistory]);

  console.log("projectGoalHistory", projectGoalHistory);

  const formattedHistory = useMemo(() => {
    const fieldLabelMap: { [key: string]: string } = {
      goalTitle: transGoal("goaltitle"),
      description: transGoal("description"),
      priority: transGoal("priority"),
      projectId: transGoal("projectname"),
      status: transGoal("status"),
      weekEnd: transGoal("startdate"),
      weekStart: transGoal("enddate")
    };

    return (
      projectGoalHistory?.updateHistory?.map((item: UpdateHistoryItem) => {
        const updatedUser = users?.find((user: User) => user.id === item.user_id);
        const loginuser_name = updatedUser?.first_name || updatedUser?.name || "Unknown";

        let formattedChanges: string[] = [];

        if (item.history_data?.previous_data && item.history_data?.update_data) {
          const previousData = item.history_data.previous_data as GoalUpdateData;
          const updateData = item.history_data.update_data as GoalUpdateData;

          formattedChanges = Object.entries(updateData)
            .filter(([key, newValue]) => {
              if (
                key === "weekStart" ||
                key === "weekEnd" ||
                newValue === "" ||
                newValue === null ||
                newValue === undefined
              ) {
                return false;
              }

              const oldValue = previousData[key];
              return oldValue !== newValue;
            })
            .map(([key, newValue]) => {
              const label = fieldLabelMap[key] || key;
              const oldValue = previousData[key];

              if (oldValue !== undefined && oldValue !== null && oldValue !== "") {
                return `${label} changed from "${oldValue}" to "${newValue}"`;
              } else {
                return `${label} updated to "${newValue}"`;
              }
            });
        } else {
          // Handle old format
          formattedChanges = Object.entries(item.history_data || {})
            .filter(([key, value]) => {
              return (
                value !== "" &&
                value !== null &&
                value !== undefined &&
                key !== "weekStart" &&
                key !== "weekEnd" &&
                key !== "timestamp" &&
                key !== "action"
              );
            })
            .map(([key, value]) => {
              const label = fieldLabelMap[key] || key;
              return `${label} updated to "${value}"`;
            });
        }

        return {
          loginuser_name,
          formatted_history:
            formattedChanges.length > 0 ? formattedChanges.join(". ") : "No changes recorded",
          created_date: item.createdAt || "",
          action: item.history_data?.action || "UPDATE"
        };
      }) ?? []
    );
  }, [projectGoalHistory?.updateHistory, users, transGoal]);
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

      await updateWeeklyGoal(goalID, payload);

      showSnackbar(transGoal("goalupdate"), SNACKBAR_SEVERITY.SUCCESS);
      await mutate(`goal-${goalID}`);

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      console.error("Error updating weekly goal:", err);
      showSnackbar(transGoal("saveError"), SNACKBAR_SEVERITY.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingGoal) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  const currentProjectOptions = currentProject ? [currentProject] : [];

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
          isEdit={true}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          onShowHistory={() => setHistory(true)}
          isSubmitting={isSubmitting}
          hasHistory={(projectGoalHistory?.updateHistory ?? []).length > 0}
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
      </Box>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />

      <HistoryDrawer
        open={history}
        onClose={() => setHistory(false)}
        history={formattedHistory}
        text={transGoal("log")}
        heading={transGoal("projectgoalhistory")}
      />
    </>
  );
};

export default EditGoalPage;
