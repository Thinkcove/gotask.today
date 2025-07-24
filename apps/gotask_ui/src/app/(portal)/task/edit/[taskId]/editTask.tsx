"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import TaskInput from "@/app/(portal)/task/createTask/taskInput";
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
import FormHeader from "@/app/component/header/formHeader";

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
    user_estimated: data?.user_estimated || "",
    story_id: data?.story_id || ""
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const [history, setHistory] = useState(false);

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

        const response = await updateTask(data.id, updatedFields);

        if (response?.success) {
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
            message: response?.message || transtask("upadteerror"),
            severity: SNACKBAR_SEVERITY.ERROR
          });
        }
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
        <FormHeader
          isEdit={true}
          onCancel={handleBack}
          onSubmit={handleSubmit}
          editheading={transtask("edittask")}
          update={transtask("save")}
          cancel={transtask("canceledit")}
          showhistory={transtask("showhistory")}
          hasHistory={data.history && data.history.length > 0}
          onShowHistory={() => setHistory(true)}
        />

        <Box sx={{ px: 2, pb: 2, maxHeight: "calc(100vh - 250px)", overflowY: "auto" }}>
          <TaskInput
            formData={formData}
            handleInputChange={handleInputChange}
            errors={{}}
            readOnlyFields={readOnlyFields}
            isUserEstimatedLocked={!!data.user_estimated}
            isStartDateLocked={!!data.start_date}
            initialStatus={data.status}
          />
        </Box>

        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />

        <HistoryDrawer
          open={history}
          onClose={() => setHistory(false)}
          history={data.history || []}
        />
      </Box>
    </>
  );
};

export default EditTask;
