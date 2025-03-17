"use client";
import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import TaskInput from "@/app/portal/task/component/taskInput";
import { createTask } from "../service/taskAction";
import { TASK_STATUS } from "@/app/common/constants/task";

const CreateTask: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: TASK_STATUS.TO_DO,
    severity: "",
    assigned_to: "",
    project_name: "",
    created_on: new Date().toISOString().split("T")[0], // Set default date
    due_date: new Date().toISOString().split("T")[0], // Set default date
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle form field changes
  const handleInputChange = (name: string, value: string | Date) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value instanceof Date ? value.toISOString().split("T")[0] : value,
    }));
  };

  // Validate required fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = "Task Title is required";
    if (!formData.assigned_to)
      newErrors.assigned_to = "Assignee Name is required";
    if (!formData.project_name)
      newErrors.project_name = "Project Name is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.severity) newErrors.severity = "Severity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createTask(formData); // Use the reusable API function
      router.back();
    } catch (error) {
      alert("Error creating task");
    }
  };

  return (
    <>
      <Box sx={{ p: 5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography variant="h4" sx={{ color: "#741B92" }}>
            Create Task :
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "54px",
                backgroundColor: "white",
                color: "black",
                border: "2px solid #741B92",
                textTransform: "none",
              }}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: "54px",
                backgroundColor: "#741B92",
                color: "white",
                textTransform: "none",
              }}
              onClick={handleSubmit}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Use TaskInput component */}
      <Box sx={{ px: 2, py: 0 }}>
        <TaskInput
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
        />
      </Box>
    </>
  );
};

export default CreateTask;
