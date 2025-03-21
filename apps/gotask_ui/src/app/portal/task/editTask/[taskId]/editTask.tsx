import React, { useEffect, useState } from "react";
import { Button, Box, Typography, Paper } from "@mui/material";
import TaskInput from "@/app/portal/task/component/taskInput";
import { TASK_SEVERITY, TASK_STATUS } from "@/app/common/constants/task";
import { useRouter } from "next/navigation";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { updateTask } from "../../service/taskAction"; // Import API function

interface EditTaskProps {
  data: any;
}

const EditTask: React.FC<EditTaskProps> = ({ data }) => {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: TASK_STATUS.TO_DO,
    severity: TASK_SEVERITY.LOW,
    user_id: "",
    project_id: "",
    created_on: "",
    due_date: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || "",
        description: data.description || "",
        status: data.status || TASK_STATUS.TO_DO,
        severity: data.severity || TASK_SEVERITY.LOW,
        user_id: data.user_id || "",
        project_id: data.project_id || "",
        created_on: data.created_on ? data.created_on.split("T")[0] : "",
        due_date: data.due_date ? data.due_date.split("T")[0] : "",
      });
    }
  }, [data]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Prepare the payload with only changed fields
      const updatedFields: Record<string, string> = {};
      if (formData.status !== data.status)
        updatedFields.status = formData.status;
      if (formData.severity !== data.severity)
        updatedFields.severity = formData.severity;
      if (formData.description !== data.description)
        updatedFields.description = formData.description;
      if (formData.due_date !== data.due_date)
        updatedFields.due_date = formData.due_date;

      if (Object.keys(updatedFields).length === 0) {
        setSnackbar({
          open: true,
          message: "No changes detected",
          severity: SNACKBAR_SEVERITY.INFO,
        });
        return;
      }

      await updateTask(data.id, updatedFields);

      setSnackbar({
        open: true,
        message: "Task updated successfully!",
        severity: SNACKBAR_SEVERITY.SUCCESS,
      });

      setTimeout(() => router.back(), 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating task",
        severity: SNACKBAR_SEVERITY.ERROR,
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          p: 4,
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Title with Gradient Effect */}
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#741B92" }}
          >
            Edit Task
          </Typography>

          {/* Buttons with Soft Hover Effects */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "30px",
                color: "black",
                border: "2px solid  #741B92",
                px: 2,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: "30px",
                backgroundColor: " #741B92",
                color: "white",
                px: 2,
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "rgb(202, 187, 201) 100%)",
                },
              }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Task Form */}
      <Box
        sx={{
          px: 2,
          py: 2,
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
        }}
      >
        <TaskInput
          formData={formData}
          handleInputChange={handleInputChange}
          errors={{}}
          readOnlyFields={["title", "user_id", "project_id", "created_on"]}
        />
      </Box>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default EditTask;
