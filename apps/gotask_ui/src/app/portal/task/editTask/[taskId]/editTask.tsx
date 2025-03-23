import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import TaskInput from "@/app/portal/task/component/taskInput";
import { TASK_SEVERITY, TASK_STATUS } from "@/app/common/constants/task";
import { useRouter } from "next/navigation";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { updateTask } from "../../service/taskAction";
import { History } from "@mui/icons-material";
import { ITask } from "../../interface/taskInterface";
import HistoryDrawer from "../../component/taskHistory";
import { useAuth } from "@/app/provider/authProvider";

interface EditTaskProps {
  data: ITask;
}

const EditTask: React.FC<EditTaskProps> = ({ data }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [openDrawer, setOpenDrawer] = useState(false); // Drawer state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO,
  });

  const [formData, setFormData] = useState(() => ({
    title: data?.title || "",
    description: data?.description || "",
    status: data?.status || TASK_STATUS.TO_DO,
    severity: data?.severity || TASK_SEVERITY.LOW,
    user_id: data?.user_id || "",
    project_id: data?.project_id || "",
    created_on: data?.created_on ? data.created_on.split("T")[0] : "",
    due_date: data?.due_date ? data.due_date.split("T")[0] : "",
  }));

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updatedFields: Record<string, string | number> = {};
      // Normalize the due_date format for comparison
      const formattedDueDate = data.due_date ? data.due_date.split("T")[0] : "";
      if (formData.status !== data.status) {
        updatedFields.status = formData.status;
        if (user?.name) updatedFields.user_name = user.name;
        if (user?.id) updatedFields.user_id = user.id;
      }
      if (formData.severity !== data.severity) {
        updatedFields.severity = formData.severity;
        if (user?.name) updatedFields.user_name = user.name;
        if (user?.id) updatedFields.user_id = user.id;
      }
      // Only update due_date if it's actually different
      if (formData.due_date !== formattedDueDate) {
        updatedFields.due_date = formData.due_date;
        if (user?.name) updatedFields.user_name = user.name;
        if (user?.id) updatedFields.user_id = user.id;
      }
      if (formData.description !== data.description) {
        updatedFields.description = formData.description;
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
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#741B92" }}
          >
            Edit Task
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
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
              }}
              onClick={() => router.back()}
            >
              Cancel
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
                "&:hover": { backgroundColor: "rgb(202, 187, 201) 100%)" },
              }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>
        </Box>

        {/* Show History Button - Only If There is History */}
        {data.history && data.history.length > 0 && (
          <Box
            sx={{
              textDecoration: "underline",

              marginTop: 2,
              display: "flex",
              gap: 1,
              color: "#741B92",
            }}
          >
            <Typography
              onClick={() => setOpenDrawer(true)}
              sx={{ cursor: "pointer" }}
            >
              Show History
            </Typography>
            <History />
          </Box>
        )}
      </Box>

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

      {/* History Drawer Component */}
      <HistoryDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        history={data.history || []}
      />
    </>
  );
};

export default EditTask;
