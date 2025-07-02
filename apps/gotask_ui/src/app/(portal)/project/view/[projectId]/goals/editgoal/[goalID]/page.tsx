"use client";
import React, { useState, useMemo } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useUser } from "@/app/userContext";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import useSWR from "swr";
import { fetcherUserList } from "@/app/(portal)/user/services/userAction";
import { getWeeklyGoalById, updateWeeklyGoal } from "../../goalservices/projectGoalAction";
import ProjectGoalForm from "../../components/projectGoalForm";
import HistoryDrawer from "../../components/history";
import { useGoalForm } from "../../goalHook/useGoalForm";
import { UpdateHistoryItem, User } from "../../interface/projectGoal";
import FormHeader from "../../../../../../access/components/FormHeader";
import { useAllProjects } from "@/app/(portal)/task/service/taskAction";

const fetchGoalData = async (goalId: string) => {
  if (!goalId) throw new Error("Goal ID is required");
  const response = await getWeeklyGoalById(goalId);
  return response?.data || null;
};

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
  console.log("getAllProjects", getAllProjects);

  // Step 2: Find current project
  const currentProject = getAllProjects?.find(
    (project: { id: string }) => project.id === projectID
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState(false);

  const { data: users } = useSWR("fetch-user", fetcherUserList);

  const {
    data: fetchedGoalData,
    error: goalError,
    isLoading: isLoadingGoal
  } = useSWR(goalID ? `goal-${goalID}` : null, () => fetchGoalData(goalID), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 1
  });

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

  const formattedHistory = useMemo(() => {
    const fieldLabelMap: { [key: string]: string } = {
      goalTitle: transGoal("goaltitle"),
      description: transGoal("description"),
      priority: transGoal("priority"),
      projectId: transGoal("projectname"),
      status: transGoal("status"),
      weekEnd: transGoal("weekEnd"),
      weekStart: transGoal("weekStart")
    };

    return (
      projectGoalHistory?.updateHistory?.map((item: UpdateHistoryItem) => {
        const updatedUser = users?.find((user: User) => user.id === item.user_id);
        const loginuser_name = updatedUser?.first_name || updatedUser?.name || "Unknown";

        const formattedChanges = Object.entries(item.history_data || {})
          .filter(([key, value]) => value !== "" && key !== "weekStart" && key !== "weekEnd")
          .map(([key, value]) => {
            const label = fieldLabelMap[key] || key;
            return `${label} updated to "${value}"`;
          });

        return {
          loginuser_name,
          formatted_history: formattedChanges.join(". "),
          created_date: item.timestamp || ""
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
        updated_by: user?.id ?? ""
      };

      console.log("Submitting payload:", payload);

      await updateWeeklyGoal(goalID, payload);

      showSnackbar(transGoal("goalupdate"), SNACKBAR_SEVERITY.SUCCESS);

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

  if (goalError) {
    showSnackbar(transGoal("fetchError") || "Error fetching goal data", SNACKBAR_SEVERITY.ERROR);
  }

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
        isEdit={true}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        onShowHistory={() => setHistory(true)}
        isSubmitting={isSubmitting}
        hasHistory={(projectGoalHistory?.updateHistory ?? []).length > 0}
        showModuleHeader={true}
        projectname={currentProject?.name}
      />

      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <ProjectGoalForm
          rteRef={rteRef}
          goalData={goalData}
          setGoalData={setGoalData}
          errors={errors}
          currentProjectOptions={[]}
          currentProject={undefined}
          handleProjectChange={function (value: string | number | string[] | Date): void {
            throw new Error("Function not implemented.");
          }}
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
    </Box>
  );
};

export default EditGoalPage;
