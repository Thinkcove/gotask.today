import React, { useState, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import FormField from "../../../component/input/formField";
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

  // Memoized function to get current user object
  const getCurrentUser = useMemo(() => {
    if (!formData.user_id) return null;

    // First check in filtered users
    let user = filteredUsers.find((u: User) => u.id === formData.user_id);

    // If not found, check in all users
    if (!user && getAllUsers) {
      user = getAllUsers.find((u: User) => u.id === formData.user_id);
    }

    // If still not found but we have user_name in formData, create a user object
    if (!user && formData.user_name) {
      user = {
        id: formData.user_id,
        name: formData.user_name
      } as User;
    }

    return user;
  }, [formData.user_id, formData.user_name, filteredUsers, getAllUsers]);

  // Memoized function to get current project object
  const getCurrentProject = useMemo(() => {
    if (!formData.project_id) return null;

    // First check in filtered projects
    let project = filteredProjects.find((p: Project) => p.id === formData.project_id);

    // If not found, check in all projects
    if (!project && getAllProjects) {
      project = getAllProjects.find((p: Project) => p.id === formData.project_id);
    }

    // If still not found but we have project_name in formData, create a project object
    if (!project && formData.project_name) {
      project = {
        id: formData.project_id,
        name: formData.project_name
      } as Project;
    }

    return project;
  }, [formData.project_id, formData.project_name, filteredProjects, getAllProjects]);

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

  // Get user options with current user included if not already present
  const getUserOptions = () => {
    let options: User[] = [];

    if (formData.project_id) {
      options = [...filteredUsers];
    } else {
      options = [...(getAllUsers || [])];
    }

    // Ensure current user is included in options
    const currentUser = getCurrentUser;
    if (currentUser && !options.find((u: User) => u.id === currentUser.id)) {
      options.unshift(currentUser);
    }

    return options;
  };

  // Get project options with current project included if not already present
  const getProjectOptions = () => {
    let options: Project[] = [];

    if (!formData.user_id) {
      options = [...(getAllProjects || [])];
    } else {
      options = [...filteredProjects];
    }

    // Ensure current project is included in options
    const currentProject = getCurrentProject;
    if (currentProject && !options.find((p: Project) => p.id === currentProject.id)) {
      options.unshift(currentProject);
    }

    return options;
  };

  const userOptions = getUserOptions();
  const projectOptions = getProjectOptions();
  const currentStatus = formData.status;
  const allowedStatuses = TASK_WORKFLOW[currentStatus] || [];

  // Include current status in options
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

        <Grid item xs={12} sm={6} md={3}>
          <FormField
            label={transtask("labelstartdate")}
            type="date"
            placeholder={transtask("placeholderstartdate")}
            value={formData.start_date || new Date().toISOString().split("T")[0]}
            onChange={(value) =>
              handleInputChange(
                "start_date",
                value instanceof Date ? value.toISOString().split("T")[0] : String(value)
              )
            }
            disabled={isReadOnly("start_date")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormField
            label={transtask("labeluserestimateddays")}
            type="number"
            min={0}
            value={
              formData.user_estimated?.includes("d") ? formData.user_estimated.split("d")[0] : ""
            }
            onChange={(val) => {
              const hours = formData.user_estimated?.split("d")[1]?.replace("h", "").trim() || "";
              const days = val === "" ? "" : val;
              handleInputChange("user_estimated", `${days || 0}d${hours || 0}h`);
            }}
            disabled={isReadOnly("user_estimated")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormField
            label={transtask("labeluserestimatedhours")}
            type="number"
            min={1}
            max={8}
            value={
              formData.user_estimated?.includes("d")
                ? formData.user_estimated.split("d")[1]?.replace("h", "").trim() || ""
                : ""
            }
            onChange={(val) => {
              const days = formData.user_estimated?.split("d")[0] || "";
              const hours = val === "" ? "" : val;
              handleInputChange("user_estimated", `${days || 0}d${hours || 0}h`);
            }}
            disabled={isReadOnly("user_estimated")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
