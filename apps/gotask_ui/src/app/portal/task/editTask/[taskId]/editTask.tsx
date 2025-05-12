"use client";

import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import TaskInput from "@/app/portal/task/createTask/taskInput";
import { TASK_SEVERITY, TASK_STATUS } from "@/app/common/constants/task";
import { useRouter } from "next/navigation";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { createComment, updateTask } from "../../service/taskAction";
import { History } from "@mui/icons-material";
import { IFormField, ITask, ITaskComment } from "../../interface/taskInterface";
import HistoryDrawer from "../taskHistory";
import TaskComments from "../taskComments";
import { useUser } from "@/app/userContext";
import { KeyedMutator } from "swr";
import TimeSpentPopup from "../timeSpentPopup";
import TimeProgressBar from "@/app/portal/task/editTask/timeProgressBar";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
interface EditTaskProps {
  data: ITask;
  mutate: KeyedMutator<ITask>;
}

const EditTask: React.FC<EditTaskProps> = ({ data, mutate }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const router = useRouter();
  const { user } = useUser();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<IFormField>({
    title: data?.title || "",
    description: data?.description || "",
    status: data?.status || TASK_STATUS.TO_DO,
    severity: data?.severity || TASK_SEVERITY.LOW,
    user_id: data?.user_id || "",
    user_name: data?.user_name || "",
    project_id: data?.project_id || "",
    project_name: data?.project_name || "",
    created_on: data?.created_on ? data.created_on.split("T")[0] : "",
    due_date: data?.due_date ? data.due_date.split("T")[0] : ""
  });

  const checkIfDateExists = (): boolean => {
    if (!data.time_spent || !Array.isArray(data.time_spent)) {
      return false;
    }
    const today = new Date().toISOString().split("T")[0];
    return data.time_spent.some((entry) => entry.date === today);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const alreadyExists = checkIfDateExists();

  const handleProgressClick = () => {
    if (!alreadyExists) {
      setIsPopupOpen(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedFields: Record<string, string | number> = {};
      const formattedDueDate = data.due_date ? data.due_date.split("T")[0] : "";
      if (formData.status !== data.status) {
        updatedFields.status = formData.status;
        if (user?.name) updatedFields.loginuser_name = user.name;
        if (user?.id) updatedFields.loginuser_id = user.id;
      }
      if (formData.severity !== data.severity) {
        updatedFields.severity = formData.severity;
        if (user?.name) updatedFields.loginuser_name = user.name;
        if (user?.id) updatedFields.loginuser_id = user.id;
      }
      if (formData.due_date !== formattedDueDate) {
        updatedFields.due_date = formData.due_date;
      }

      if (formData.description !== data.description) {
        updatedFields.description = formData.description;
      }

      if (Object.keys(updatedFields).length > 0) {
        if (user?.name) updatedFields.loginuser_name = user.name;
        if (user?.id) updatedFields.loginuser_id = user.id;
      }

      if (Object.keys(updatedFields).length === 0) {
        setSnackbar({
          open: true,
          message: transtask("nochanges"),
          severity: SNACKBAR_SEVERITY.INFO
        });
        return;
      }
      await updateTask(data.id, updatedFields);
      await mutate();
      setSnackbar({
        open: true,
        message: transtask("updatesuccess"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      setTimeout(() => router.back(), 2000);
    } catch (error) {
      console.error("Error while updating task:", error);
      setSnackbar({
        open: true,
        message: transtask("upadteerror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const submitComment = async (commentText: string) => {
    if (!commentText.trim()) return;

    try {
      const commentData: ITaskComment = {
        task_id: data.id,
        user_id: user?.id || "",
        user_name: user?.name || "",
        comment: commentText
      };

      await createComment(commentData);
      await mutate();
    } catch (error) {
      console.error("Error submitting comment:", error);
      setSnackbar({
        open: true,
        message: transtask("commenterror") || "Failed to add comment",
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  return (
    <>
      <ModuleHeader name={transtask("tasks")} />
      <Box
        sx={{
          maxWidth: "1400px",
          margin: "0 auto",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            px: 2,
            pt: 2,
            zIndex: 1000,
            flexDirection: "column",
            gap: 2
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
              {transtask("edittask")}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "rgba(202, 187, 201, 0.9)" }
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

        <TimeProgressBar
          estimatedTime={data.estimated_time || "0h"}
          timeSpentTotal={data.time_spent_total || "0h"}
          dueDate={data.due_date || ""}
          timeEntries={data.time_spent || []}
          canLogTime={!alreadyExists} // Pass the existing check as a prop
          variation={data.variation ? String(data.variation) : "0d0h"} // Convert to string
          onClick={handleProgressClick}
        />

        <Box
          sx={{
            px: 2,
            pb: 2,
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto"
          }}
        >
          <TaskInput
            formData={formData}
            handleInputChange={handleInputChange}
            errors={{}}
            readOnlyFields={["title", "user_id", "project_id", "created_on"]}
          />
          <TaskComments comments={data.comment || []} onSave={submitComment} />
        </Box>

        <TimeSpentPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          originalEstimate={data.estimated_time || "0d0h"}
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
