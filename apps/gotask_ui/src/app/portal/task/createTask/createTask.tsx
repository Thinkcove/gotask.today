"use client";
import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import TaskInput from "@/app/portal/task/createTask/taskInput";
import { createTask } from "../service/taskAction";
import { TASK_SEVERITY, TASK_STATUS } from "@/app/common/constants/task";
import { useRouter } from "next/navigation";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { IFormField } from "../interface/taskInterface";

const CreateTask: React.FC = () => {
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
    project_id: "",
    created_on: new Date().toISOString().split("T")[0],
    due_date: new Date().toISOString().split("T")[0]
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle form field changes
  const handleInputChange = (name: string, value: string | Date) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value instanceof Date ? value.toISOString().split("T")[0] : value
    }));
  };

  // Validate required fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = "Task Title is required";
    if (!formData.user_id) newErrors.user_id = "Assignee Name is required";
    if (!formData.project_id) newErrors.project_id = "Project Name is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.severity) newErrors.severity = "Severity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await createTask(formData);
      setSnackbar({
        open: true,
        message: "Task created successfully!",
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      setTimeout(() => router.back(), 2000);
    } catch (error) {
      console.error("Error while creating task:", error);
      setSnackbar({
        open: true,
        message: "Error while creating task",
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const router = useRouter();

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          px: 2,
          py: 2,
          zIndex: 1000
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
          {/* Title with Gradient Effect */}
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
            Create Task
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
                  backgroundColor: "rgba(255, 255, 255, 0.2)"
                }
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
                  backgroundColor: "rgb(202, 187, 201) 100%)"
                }
              }}
              onClick={handleSubmit}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Scrollable TaskInput Container */}
      <Box
        sx={{
          px: 2,
          pb: 2,
          maxHeight: "calc(100vh - 150px)", // Adjust height dynamically
          overflowY: "auto" // Enables vertical scrolling
        }}
      >
        <TaskInput formData={formData} handleInputChange={handleInputChange} errors={errors} />
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

export default CreateTask;
