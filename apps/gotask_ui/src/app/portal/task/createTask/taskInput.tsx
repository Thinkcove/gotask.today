import React, { useState } from "react";
import { Grid } from "@mui/material";
import FormField from "../../../component/formField";
import { TASK_SEVERITY, TASK_WORKFLOW } from "../../../common/constants/task";
import {
  useAllProjects,
  useAllUsers,
  getProjectIdsAndNames,
  getUsersByProjectId
} from "../service/taskAction";
import { IFormField, Project, User } from "../interface/taskInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface TaskInputProps {
  formData: IFormField;
  handleInputChange: (name: string, value: string | Project[] | User[]) => void;
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
  const { getAllUsers } = useAllUsers(); // getAllUsers is User[]
  const { getAllProjects } = useAllProjects(); // getAllProjects is Project[]

  // State to hold filtered data
  const [filteredUsers, setFilteredUsers] = useState<User[]>(getAllUsers || []);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(getAllProjects || []);

  // Helper function to determine if a field should be read-only
  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  // Handle Assignee change and fetch projects
  const handleAssigneeChange = async (userId: string) => {
    handleInputChange("user_id", userId);

    if (!userId) {
      setFilteredProjects(getAllProjects || []);
      handleInputChange("projects", getAllProjects || []);
      return;
    }

    try {
      const projects = await getProjectIdsAndNames(userId);
      setFilteredProjects(projects);
      handleInputChange("projects", projects);

      // Reset project_id only if it's not valid for the selected user
      if (formData.project_id && !projects.some((p: Project) => p.id === formData.project_id)) {
        handleInputChange("project_id", "");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setFilteredProjects(getAllProjects || []);
      handleInputChange("projects", getAllProjects || []);
    }
  };

  // Handle Project change and fetch users
  const handleProjectChange = async (projectId: string) => {
    handleInputChange("project_id", projectId);

    if (!projectId) {
      setFilteredUsers(getAllUsers || []);
      handleInputChange("users", getAllUsers || []);
      return;
    }

    try {
      const users = await getUsersByProjectId(projectId);
      setFilteredUsers(users);
      handleInputChange("users", users);

      // Reset user_id only if it's not valid for the selected project
      if (formData.user_id && !users.some((u: User) => u.id === formData.user_id)) {
        handleInputChange("user_id", "");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setFilteredUsers(getAllUsers || []);
      handleInputChange("users", getAllUsers || []);
    }
  };

  // Determine which options to show
  const getUserOptions = () => {
    // Use filtered users if a project is selected and users are loaded
    if (formData.project_id && filteredUsers.length > 0) {
      return filteredUsers;
    }
    // Fallback to all users
    return getAllUsers || [];
  };

  const getProjectOptions = () => {
    // Don't show any project if no user is selected
    if (!formData.user_id) {
      return [];
    }

    return filteredProjects;
  };

  const userOptions = getUserOptions();
  const projectOptions = getProjectOptions();

  const currentStatus = formData.status || "";
  const allowedStatuses = TASK_WORKFLOW[currentStatus] || [];

  // Include current status in options
  const uniqueStatuses = Array.from(new Set([currentStatus, ...allowedStatuses])).filter(Boolean);

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
            options={userOptions}
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
            options={projectOptions}
            required
            placeholder={transtask("placeholderproject")}
            value={formData.project_id}
            onChange={(value) => handleProjectChange(String(value))}
            error={errors.project_id}
            disabled={isReadOnly("project_id")}
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
