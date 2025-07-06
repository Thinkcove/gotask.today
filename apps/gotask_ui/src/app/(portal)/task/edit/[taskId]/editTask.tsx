"use client";

import React, { useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { ArrowBack, History } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import TaskInput from "@/app/(portal)/task/createTask/taskInput";
import TimeSpentPopup from "../timeSpentPopup";
import HistoryDrawer from "../taskHistory";
import ModuleHeader from "@/app/component/header/moduleHeader";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { updateTask } from "../../service/taskAction";
import { useUser } from "@/app/userContext";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { TASK_STATUS, TASK_SEVERITY } from "@/app/common/constants/task";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/permission";
import { IFormField, ITask, Project, User } from "../../interface/taskInterface";
import { KeyedMutator } from "swr";
import { TASK_FORM_FIELDS } from "@/app/common/constants/taskFields";
import TimeProgressBar from "../timeProgressBar";

interface EditTaskProps {
  data: ITask;
  mutate: KeyedMutator<ITask>;
}

const EditTask: React.FC<EditTaskProps> = ({ data, mutate }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const router = useRouter();
  const { user } = useUser();
  const { isFieldRestricted } = useUserPermission();

  const [formData, setFormData] = useState<IFormField>({
    title: data?.title || "",
    description: data?.description || "",
    status: data?.status || TASK_STATUS.TO_DO,
    severity: data?.severity || TASK_SEVERITY.LOW,
    user_id: data?.user_id || "",
    project_id: data?.project_id || "",
    created_on: data?.created_on?.split("T")[0] || "",
    due_date: data?.due_date?.split("T")[0] || "",
    start_date: data?.start_date?.split("T")[0] || "",
    user_estimated: data?.user_estimated || ""
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const [openDrawer, setOpenDrawer] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleInputChange = (name: string, value: string | Project[] | User[]) => {
    if (!isFieldRestricted(APPLICATIONS.TASK, ACTIONS.UPDATE, name)) {
      if (typeof value === "string") {
        setFormData((prev) => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  const alreadyExists = data?.time_spent?.some(
    (entry) => entry.date === new Date().toISOString().split("T")[0]
  );

  const handleProgressClick = () => {
    if (!alreadyExists) setIsPopupOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const isUserEstimatedChanged = formData.user_estimated !== data.user_estimated;
      const isUserEstimateProvided =
        formData.user_estimated !== null &&
        formData.user_estimated !== undefined &&
        formData.user_estimated !== "";

      const updatedFields: Record<string, string | number> = {};
      const formattedDueDate = data?.due_date?.split("T")[0] || "";
      const formattedStartDate = data?.start_date?.split("T")[0] || "";

      const fieldCheck = (field: keyof IFormField, current: string) => {
        return (
          !isFieldRestricted(APPLICATIONS.TASK, ACTIONS.UPDATE, field) &&
          formData[field] !== current
        );
      };

      if (fieldCheck("title", data.title)) updatedFields.title = formData.title;
      if (fieldCheck("user_id", data.user_id)) updatedFields.user_id = formData.user_id;
      if (fieldCheck("project_id", data.project_id)) updatedFields.project_id = formData.project_id;
      if (fieldCheck("status", data.status)) updatedFields.status = formData.status;
      if (fieldCheck("severity", data.severity)) updatedFields.severity = formData.severity;
      if (fieldCheck("due_date", formattedDueDate)) updatedFields.due_date = formData.due_date;
      if (fieldCheck("start_date", formattedStartDate))
        updatedFields.start_date = formData.start_date;
      if (fieldCheck("description", data.description)) {
        updatedFields.description = formData.description;
      }

      if (isUserEstimatedChanged && isUserEstimateProvided) {
        updatedFields.user_estimated = formData.user_estimated;
      }

      if (Object.keys(updatedFields).length > 0) {
        if (user?.name) updatedFields.loginuser_name = user.name;
        if (user?.id) updatedFields.loginuser_id = user.id;

        await updateTask(data.id, updatedFields);
        await mutate();

        setSnackbar({
          open: true,
          message: transtask("updatesuccess"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });

        setTimeout(() => router.back(), 2000);
      } else {
        setSnackbar({
          open: true,
          message: transtask("noupdates"),
          severity: SNACKBAR_SEVERITY.INFO
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setSnackbar({
        open: true,
        message: transtask("upadteerror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const handleBack = () => router.back();

  const readOnlyFields = TASK_FORM_FIELDS.filter((field) =>
    isFieldRestricted(APPLICATIONS.TASK, ACTIONS.UPDATE, field)
  );

  return (
    <>
      <ModuleHeader name={transtask("tasks")} />

      <Box sx={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Box sx={{ position: "sticky", top: 0, px: 2, pt: 2, zIndex: 1000 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton color="primary" onClick={handleBack}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
                {transtask("edittask")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "30px",
                  color: "black",
                  border: "2px solid #741B92",
                  px: 2,
                  textTransform: "none"
                }}
                onClick={handleBack}
              >
                {transtask("canceledit")}
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "30px",
                  backgroundColor: "#741B92",
                  color: "white",
                  px: 2,
                  textTransform: "none",
                  fontWeight: "bold"
                }}
                onClick={handleSubmit}
              >
                {transtask("save")}
              </Button>
            </Box>
          </Box>
        </Box>

        {data.history && data.history.length > 0 && (
          <Box
            sx={{
              textDecoration: "underline",
              display: "flex",
              gap: 1,
              color: "#741B92",
              px: 2
            }}
          >
            <Typography onClick={() => setOpenDrawer(true)} sx={{ cursor: "pointer" }}>
              {transtask("showhistory")}
            </Typography>
            <History />
          </Box>
        )}

        {data.status !== TASK_STATUS.TO_DO && (
          <TimeProgressBar
            estimatedTime={data.estimated_time || "0h0m"}
            timeSpentTotal={data.time_spent_total || "0h0m"}
            dueDate={data.user_estimated || "0d0h0m"}
            startDate={data.start_date || ""}
            timeEntries={data.time_spent || []}
            canLogTime={!alreadyExists}
            variation={data.variation ? String(data.variation) : "0d0h0m"}
            onClick={handleProgressClick}
          />
        )}

        <Box sx={{ px: 2, pb: 2, maxHeight: "calc(100vh - 250px)", overflowY: "auto" }}>
          <TaskInput
            formData={formData}
            handleInputChange={handleInputChange}
            errors={{}}
            readOnlyFields={readOnlyFields}
            isUserEstimatedLocked={!!data.user_estimated}
            isStartDateLocked={!!data.start_date}
          />
        </Box>

        <TimeSpentPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          originalEstimate={data.estimated_time || "0d0h0m"}
          taskId={data.id}
          dueDate={data.due_date || ""}
          mutate={mutate}
        />

        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />

        <HistoryDrawer
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          history={data.history || []}
        />
      </Box>
    </>
  );
};

export default EditTask;
