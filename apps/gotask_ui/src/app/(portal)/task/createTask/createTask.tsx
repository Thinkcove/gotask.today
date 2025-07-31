import React, { useState, useCallback } from "react";
import { Box } from "@mui/material";
import { createTask } from "../service/taskAction";
import { TASK_SEVERITY, TASK_STATUS } from "@/app/common/constants/task";
import { useRouter, useSearchParams } from "next/navigation";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { IFormField, Project, User } from "../interface/taskInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import moment from "moment-timezone";
import TaskInput from "./taskInput";
import FormHeader from "@/app/component/header/formHeader";

const CreateTask: React.FC = () => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const router = useRouter();
  const searchParams = useSearchParams();
  const storyId = searchParams.get("storyId");
  const projectId = searchParams.get("projectId");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const [formData, setFormData] = useState<IFormField>({
    title: "",
    description: "",
    status: TASK_STATUS.TO_DO,
    severity: TASK_SEVERITY.LOW,
    task_mode: "",
    user_id: "",
    project_id: projectId || "",
    created_on: moment().format("YYYY-MM-DD"),
    due_date: "",
    start_date: "",
    user_estimated: "",
    story_id: storyId || ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = useCallback(
    (name: string, value: string | Date | Project[] | User[]) => {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value instanceof Date ? value.toISOString().split("T")[0] : value
      }));
    },
    []
  );

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = transtask("tasktitle");
    if (!formData.user_id) newErrors.user_id = transtask("assigneename");
    if (!formData.project_id) newErrors.project_id = transtask("projectname");
    if (!formData.status) newErrors.status = transtask("status");
    if (!formData.severity) newErrors.severity = transtask("severity");
    if (!formData.task_mode) newErrors.severity = transtask("severity");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, transtask]);

  const getCleanedPayload = useCallback((data: IFormField) => {
    const cleaned = { ...data };
    delete cleaned.users;
    delete cleaned.projects;
    delete cleaned.user_name;
    delete cleaned.project_name;
    return cleaned;
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = getCleanedPayload(formData);
      await createTask(payload);

      setSnackbar({
        open: true,
        message: transtask("successmessage"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });

      router.back();
    } catch (error) {
      console.error("Error while creating task:", error);
      setSnackbar({
        open: true,
        message: transtask("errormessage"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  }, [formData, validateForm, getCleanedPayload, transtask, router]);

  const handleBack = () => router.back();

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        margin: "0 auto",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <FormHeader
        isEdit={false}
        onCancel={handleBack}
        onSubmit={handleSubmit}
        createHeading={transtask("create")}
        create={transtask("creates")}
        cancel={transtask("cancelcreate")}
        isSubmitting={isSubmitting}
      />

      <Box sx={{ px: 2, pb: 2, maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
        <TaskInput
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
          readOnlyFields={storyId ? ["status"] : ["status"]}
          isProjectLocked={!!projectId}
          isStoryLocked={!!storyId}
        />
      </Box>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default CreateTask;
