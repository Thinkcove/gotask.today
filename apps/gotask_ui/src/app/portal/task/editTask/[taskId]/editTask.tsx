import React, { useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
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
    assigned_to: "",
    project_name: "",
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
        assigned_to: data.assigned_to || "",
        project_name: data.project_name || "",
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
          p: 5,
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" sx={{ color: "#741B92" }}>
            Edit Task:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "54px",
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
              Save Changes
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
          readOnlyFields={[
            "title",
            "assigned_to",
            "project_name",
            "created_on",
          ]}
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
