import { useState, useRef, useMemo } from "react";
import { RichTextEditorRef } from "mui-tiptap";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { GoalData } from "../interface/projectGoal";

export const useGoalForm = (projectId: string, initialData?: any) => {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);
  const rteRef = useRef<RichTextEditorRef>(null);

  const initialGoalData = useMemo(
    () => ({
      goalTitle: initialData?.goalTitle || "",
      description: initialData?.description || "",
      weekStart: initialData?.weekStart || "",
      weekEnd: initialData?.weekEnd || "",
      status: initialData?.status || "",
      priority: initialData?.priority || "",
      projectId: projectId,
      user_id: initialData?.user_id || "",
      id: initialData?.id
    }),
    [initialData, projectId]
  );

  const [goalData, setGoalData] = useState<GoalData>(initialGoalData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const syncWithInitialData = () => {
    if (initialData) {
      setGoalData({
        goalTitle: initialData.goalTitle || "",
        description: initialData.description || "",
        weekStart: initialData.weekStart || "",
        weekEnd: initialData.weekEnd || "",
        status: initialData.status || "",
        priority: initialData.priority || "",
        projectId: projectId,
        user_id: initialData.user_id || "",
        id: initialData.id
      });
    }
  };

  const needsSync = useMemo(() => {
    if (!initialData) return false;
    return (
      goalData.goalTitle !== (initialData.goalTitle || "") ||
      goalData.description !== (initialData.description || "") ||
      goalData.weekStart !== (initialData.weekStart || "") ||
      goalData.weekEnd !== (initialData.weekEnd || "") ||
      goalData.status !== (initialData.status || "") ||
      goalData.priority !== (initialData.priority || "") ||
      goalData.user_id !== (initialData.user_id || "") ||
      goalData.id !== initialData.id
    );
  }, [goalData, initialData]);

  if (needsSync) {
    syncWithInitialData();
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!goalData.goalTitle) newErrors.goalTitle = transGoal("titlerequired");
    if (!goalData.weekStart) newErrors.weekStart = transGoal("startweekrequired");
    if (!goalData.weekEnd) newErrors.weekEnd = transGoal("endweekrequired");
    if (!goalData.priority) newErrors.priority = transGoal("priorityreuired");
    if (!goalData.status) newErrors.status = transGoal("statusrequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setGoalData({
      goalTitle: "",
      description: "",
      weekStart: "",
      weekEnd: "",
      status: "",
      priority: "",
      projectId: projectId,
      user_id: "",
      id: undefined
    });
    setErrors({});
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showSnackbar = (message: string, severity: string = SNACKBAR_SEVERITY.INFO) => {
    setSnackbar({
      open: true,
      message,
      severity: severity as SNACKBAR_SEVERITY
    });
  };

  const updateGoalData = (newData: Partial<GoalData>) => {
    setGoalData((prev) => ({
      ...prev,
      ...newData,
      projectId: projectId
    }));
  };

  return {
    goalData,
    setGoalData,
    errors,
    setErrors,
    snackbar,
    rteRef,
    validateForm,
    resetForm,
    handleSnackbarClose,
    showSnackbar,
    updateGoalData
  };
};
