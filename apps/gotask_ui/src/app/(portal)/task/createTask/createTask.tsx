import React, { useState, useCallback, startTransition } from "react";
import { Button, Box, Typography } from "@mui/material";
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

const CreateTask: React.FC = () => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const router = useRouter();
  const searchParams = useSearchParams();
  const storyId = searchParams.get("storyId");
  const projectId = searchParams.get("projectId");

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
      startTransition(() => {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value instanceof Date ? value.toISOString().split("T")[0] : value
        }));
      });
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
      <Box sx={{ position: "sticky", top: 0, px: 2, py: 2, zIndex: 1000 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
            {transtask("create")}
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
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)"
                }
              }}
              onClick={() => router.back()}
            >
              {transtask("cancelcreate")}
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
              {transtask("creates")}
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 2, pb: 2, maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
        <TaskInput
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
          readOnlyFields={storyId ? ["status"] : ["status"]}
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
