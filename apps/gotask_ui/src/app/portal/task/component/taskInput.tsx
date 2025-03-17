import React from "react";
import { Grid } from "@mui/material";
import FormField from "../../../component/formField";
import { TASK_SEVERITY, TASK_STATUS } from "../../../common/constants/task";
import { fetchAllProjects, fetchAllUsers } from "../service/taskAction";

interface TaskInputProps {
  formData: any;
  handleInputChange: (name: string, value: string) => void;
  errors: { [key: string]: string };
}

const TaskInput: React.FC<TaskInputProps> = ({
  formData,
  handleInputChange,
  errors,
}) => {
  const { getAllUsers } = fetchAllUsers();
  const { getAllProjects } = fetchAllProjects();
  return (
    <>
      <Grid item xs={12} sm={6}>
        <FormField
          label="Task Title * :"
          type="text"
          required
          placeholder="Enter Task Name"
          value={formData.title}
          onChange={(value) => handleInputChange("title", String(value))}
          error={errors.title}
        />
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormField
            label="Assignee Name * :"
            type="select"
            options={getAllUsers}
            required
            placeholder="Select Assignee Name"
            value={formData.assigned_to}
            onChange={(value) =>
              handleInputChange("assigned_to", String(value))
            }
            error={errors.assigned_to}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormField
            label="Project Name * :"
            type="select"
            options={getAllProjects}
            required
            placeholder="Select Project Name"
            value={formData.project_name}
            onChange={(value) =>
              handleInputChange("project_name", String(value))
            }
            error={errors.project_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormField
            label="Status * :"
            type="select"
            options={Object.values(TASK_STATUS)}
            required
            placeholder="Select Status Type"
            value={formData.status}
            onChange={(value) => handleInputChange("status", String(value))}
            error={errors.status}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormField
            label="Severity * :"
            type="select"
            options={Object.values(TASK_SEVERITY)}
            placeholder="Select Severity Type"
            value={formData.severity}
            onChange={(value) => handleInputChange("severity", String(value))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormField
            label="Created Date * :"
            type="date"
            placeholder="Select Created Date"
            value={
              formData.created_on || new Date().toISOString().split("T")[0]
            } // Default to current date if empty
            onChange={(value) =>
              handleInputChange(
                "created_on",
                value instanceof Date
                  ? value.toISOString().split("T")[0]
                  : String(value)
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormField
            label="Due Date * :"
            type="date"
            placeholder="Select Due Date"
            value={formData.due_date || new Date().toISOString().split("T")[0]} // Default to current date if empty
            onChange={(value) =>
              handleInputChange(
                "due_date",
                value instanceof Date
                  ? value.toISOString().split("T")[0]
                  : String(value)
              )
            }
          />
        </Grid>

        <Grid item xs={12}>
          <FormField
            label="Description :"
            type="text"
            placeholder="Enter Description"
            value={formData.description}
            onChange={(value) =>
              handleInputChange("description", String(value))
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TaskInput;
