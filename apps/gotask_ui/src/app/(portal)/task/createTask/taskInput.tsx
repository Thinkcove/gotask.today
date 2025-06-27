"use client";

import React, { useState, useMemo, RefObject } from "react";
import { Grid } from "@mui/material";
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
import { MentionSuggestion } from "@/app/component/richText/mentionSuggestionOptions";
import ReusableEditor from "@/app/component/richText/textEditor";
import { RichTextEditorRef } from "mui-tiptap";

interface TaskInputProps {
  formData: IFormField;
  handleInputChange: (name: string, value: string | Project[] | User[]) => void;
  errors: { [key: string]: string };
  readOnlyFields?: string[];
  isUserEstimatedLocked?: boolean;
  isStartDateLocked?: boolean;
  onDescriptionSave?: () => void;
  rteRef?: RefObject<RichTextEditorRef | null>;
}

const TaskInput: React.FC<TaskInputProps> = ({
  formData,
  handleInputChange,
  errors,
  readOnlyFields = [],
  isUserEstimatedLocked,
  isStartDateLocked,
  onDescriptionSave,
  rteRef
}) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const { getAllUsers } = useAllUsers();
  const { getAllProjects } = useAllProjects();

  const [filteredUsers, setFilteredUsers] = useState<User[]>(getAllUsers || []);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(getAllProjects || []);

  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  const getCurrentUser = useMemo(() => {
    if (!formData.user_id) return null;

    let user = filteredUsers.find((u: User) => u.id === formData.user_id);

    if (!user && getAllUsers) {
      user = getAllUsers.find((u: User) => u.id === formData.user_id);
    }

    if (!user && formData.user_name) {
      user = {
        id: formData.user_id,
        name: formData.user_name
      } as User;
    }

    return user;
  }, [formData.user_id, formData.user_name, filteredUsers, getAllUsers]);

  const getCurrentProject = useMemo(() => {
    if (!formData.project_id) return null;

    let project = filteredProjects.find((p: Project) => p.id === formData.project_id);

    if (!project && getAllProjects) {
      project = getAllProjects.find((p: Project) => p.id === formData.project_id);
    }

    if (!project && formData.project_name) {
      project = {
        id: formData.project_id,
        name: formData.project_name
      } as Project;
    }

    return project;
  }, [formData.project_id, formData.project_name, filteredProjects, getAllProjects]);

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

      if (formData.project_id && !projects.some((p: Project) => p.id === formData.project_id)) {
        handleInputChange("project_id", "");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setFilteredProjects(getAllProjects || []);
      handleInputChange("projects", getAllProjects || []);
    }
  };

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

      if (formData.user_id && !users.some((u: User) => u.id === formData.user_id)) {
        handleInputChange("user_id", "");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setFilteredUsers(getAllUsers || []);
      handleInputChange("users", getAllUsers || []);
    }
  };

  const getUserOptions = () => {
    let options: User[] = [];

    if (formData.project_id) {
      options = [...filteredUsers];
    } else {
      options = [...(getAllUsers || [])];
    }

    const currentUser = getCurrentUser;
    if (currentUser && !options.find((u: User) => u.id === currentUser.id)) {
      options.unshift(currentUser);
    }

    return options;
  };

  const getProjectOptions = () => {
    let options: Project[] = [];

    if (!formData.user_id) {
      options = [...(getAllProjects || [])];
    } else {
      options = [...filteredProjects];
    }

    const currentProject = getCurrentProject;
    if (currentProject && !options.find((p: Project) => p.id === currentProject.id)) {
      options.unshift(currentProject);
    }

    return options;
  };

  const userListForMentions: MentionSuggestion[] = useMemo(() => {
    const allUsers = getAllUsers || [];
    return allUsers.map((user: User) => ({
      id: user.id,
      mentionLabel: user.name
    }));
  }, [getAllUsers]);

  const handleDescriptionSave = (html: string) => {
    handleInputChange("description", html);
    if (onDescriptionSave) {
      onDescriptionSave();
    }
  };

  const userOptions = getUserOptions();
  const projectOptions = getProjectOptions();
  const currentStatus = formData.status;
  const allowedStatuses = TASK_WORKFLOW[currentStatus] || [];

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
            value={formData.start_date || ""}
            onChange={(value) =>
              handleInputChange(
                "start_date",
                value instanceof Date ? value.toISOString().split("T")[0] : String(value)
              )
            }
            disabled={isReadOnly("start_date") || isStartDateLocked}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormField
            label={transtask("labeluserestimateddays")}
            type="number"
            min={0}
            placeholder={transtask("placeholderdays")}
            value={
              formData.user_estimated?.includes("d") ? formData.user_estimated.split("d")[0] : ""
            }
            onChange={(val) => {
              const hours = formData.user_estimated?.split("d")[1]?.replace("h", "").trim() || "";
              const days = val === "" ? "" : val;
              handleInputChange("user_estimated", `${days || 0}d${hours || 0}h`);
            }}
            disabled={isReadOnly("user_estimated") || isUserEstimatedLocked}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormField
            label={transtask("labeluserestimatedhours")}
            type="number"
            min={1}
            max={8}
            placeholder={transtask("placeholderhours")}
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
            disabled={isReadOnly("user_estimated") || isUserEstimatedLocked}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormField
            label={transtask("labelduedate")}
            type="date"
            placeholder={transtask("placeholderduedate")}
            value={formData.due_date || ""}
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
          <ReusableEditor
            ref={rteRef}
            content={formData.description || ""}
            onSave={handleDescriptionSave}
            placeholder={transtask("placeholderdescription")}
            readOnly={isReadOnly("description")}
            showSaveButton={false} 
            userList={userListForMentions}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TaskInput;
