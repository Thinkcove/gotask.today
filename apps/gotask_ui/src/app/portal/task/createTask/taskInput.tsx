import React from "react";
import { Grid } from "@mui/material";
import FormField from "../../../component/formField";
import { TASK_SEVERITY, TASK_WORKFLOW } from "../../../common/constants/task";
import { useAllProjects, useAllUsers, getProjectIdsAndNames } from "../service/taskAction";
import { IFormField, Project } from "../interface/taskInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface TaskInputProps {
  formData: IFormField;
  handleInputChange: (name: string, value: string) => void;
  errors: { [key: string]: string };
  readOnlyFields?: string[];
}

const TaskInput: React.FC<TaskInputProps> = ({
  formData,
  handleInputChange,
  errors,
  readOnlyFields = []
}) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const { getAllUsers } = useAllUsers();
  const { getAllProjects } = useAllProjects();
  // Get projects based on the assigned user
  const userProjects = formData.projects || getAllProjects || [];
  // Find the selected project
  const selectedProject = userProjects.find((p: Project) => p.id === formData.project_id) || {
    id: formData.project_id,
    name: formData.project_name
  };
  // Helper function to determine if a field should be read-only
  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  // Handle Assignee change and fetch projects
  const handleAssigneeChange = async (userId: string) => {
    handleInputChange("user_id", userId);

    const projects = await getProjectIdsAndNames(userId);
    handleInputChange("projects", projects); // Store projects in formData
  };
  const currentStatus = formData.status;
  const allowedStatuses = TASK_WORKFLOW[currentStatus] || [];

  // Make sure the current value is included in the options
  const uniqueStatuses = Array.from(new Set([currentStatus, ...allowedStatuses]));
  return (
    <>
      <Grid item xs={12} sm={6} mb={2}>
        <FormField
          label={transtask("labeltitle")}
          type="text"
          required
          placeholder={transtask("placeholdername")}
          value={formData.title}
          onChange={(value) => handleInputChange("title", String(value))}
          error={errors.title}
          disabled={isReadOnly("title")}
        />
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormField
            label={transtask("labelassignee")}
            type="select"
            options={getAllUsers}
            required
            placeholder={transtask("placeholderassignee")}
            value={formData.user_id}
            onChange={(value) => handleAssigneeChange(String(value))}
            error={errors.user_id}
            disabled={isReadOnly("user_id")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormField
            label={transtask("labelproject")}
            type="select"
            options={userProjects}
            required
            placeholder={transtask("placeholderproject")}
            value={selectedProject.id}
            onChange={(value) => handleInputChange("project_id", String(value))}
            error={errors.project_id}
            disabled={isReadOnly("project_id") || !formData.user_id}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormField
            label={transtask("labelstatus")}
            type="select"
            options={uniqueStatuses.map((s) => s.toUpperCase())}
            required
            placeholder={transtask("placeholderstatus")}
            value={currentStatus.toUpperCase()}
            onChange={(value) => handleInputChange("status", String(value).toLowerCase())}
            error={errors.status}
            disabled={isReadOnly("status")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormField
            label={transtask("labelseverity")}
            type="select"
            options={Object.values(TASK_SEVERITY).map((s) => s.toUpperCase())}
            placeholder={transtask("placeholderseverity")}
            value={formData.severity.toUpperCase()}
            onChange={(value) => handleInputChange("severity", String(value).toLowerCase())}
            error={errors.severity}
            disabled={isReadOnly("severity")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormField
            label={transtask("labelcreateon")}
            type="date"
            placeholder={transtask("placeholdercreatedon")}
            value={formData.created_on || new Date().toISOString().split("T")[0]}
            onChange={(value) =>
              handleInputChange(
                "created_on",
                value instanceof Date ? value.toISOString().split("T")[0] : String(value)
              )
            }
            disabled={isReadOnly("created_on")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormField
            label={transtask("labelduedate")}
            type="date"
            placeholder={transtask("placeholderduedate")}
            value={formData.due_date || new Date().toISOString().split("T")[0]}
            onChange={(value) =>
              handleInputChange(
                "due_date",
                value instanceof Date ? value.toISOString().split("T")[0] : String(value)
              )
            }
            disabled={isReadOnly("due_date")}
          />
        </Grid>

        <Grid item xs={12}>
          <FormField
            label={transtask("labeldescription")}
            type="text"
            placeholder={transtask("placeholderdescription")}
            value={formData.description}
            onChange={(value) => handleInputChange("description", String(value))}
            disabled={isReadOnly("description")}
            multiline
            height={120}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TaskInput;
