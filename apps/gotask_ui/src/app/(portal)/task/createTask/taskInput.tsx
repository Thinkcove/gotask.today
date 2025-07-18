"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import FormField from "../../../component/input/formField";
import { TASK_SEVERITY, TASK_WORKFLOW } from "../../../common/constants/task";
import {
  useAllProjects,
  useAllUsers,
  getProjectIdsAndNames,
  getUsersByProjectId
} from "../service/taskAction";
import {
  IFormField,
  Project,
  StoryOption,
  StoryResponseWithData,
  User
} from "../interface/taskInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import ReusableEditor from "@/app/component/richText/textEditor";
import { mapUsersToMentions } from "@/app/common/utils/textEditor";
import useSWR from "swr";
import { fetchUsers } from "../../user/services/userAction";
import { getStoriesByProject } from "../../projectStory/services/projectStoryActions";

interface TaskInputProps {
  formData: IFormField;
  handleInputChange: (name: string, value: string | Project[] | User[]) => void;
  errors: { [key: string]: string };
  readOnlyFields?: string[];
  isUserEstimatedLocked?: boolean;
  isStartDateLocked?: boolean;
  initialStatus?: string;
  isProjectLocked?: boolean;
  isStoryLocked?: boolean;
}

const TaskInput: React.FC<TaskInputProps> = ({
  formData,
  handleInputChange,
  errors,
  readOnlyFields = [],
  isUserEstimatedLocked,
  isStartDateLocked,
  initialStatus,
  isProjectLocked = false,
  isStoryLocked = false
}) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const { getAllUsers } = useAllUsers();
  const { getAllProjects } = useAllProjects();
  console.log("formData", formData);

  const [filteredUsers, setFilteredUsers] = useState<User[]>(getAllUsers || []);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(getAllProjects || []);

  const [projectStories, setProjectStories] = useState<StoryOption[]>([]);
  console.log("Story options:", projectStories);

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
    const result = await getStoriesByProject(projectId);

    const storyOptions = ((result as StoryResponseWithData)?.data || []).map(
      (story: { id: string; title: string }) => ({
        id: story.id,
        name: story.title
      })
    );
    setProjectStories(storyOptions);
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
console.log("currentUser", options);

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

  const { data: fetchedUsers = [] } = useSWR("userList", fetchUsers);

  const userList = useMemo(() => {
    return mapUsersToMentions(fetchedUsers || []);
  }, [fetchedUsers]);

  const userOptions = getUserOptions();
  const projectOptions = getProjectOptions();
  const currentStatus = formData.status;
  console.log("userOptions", userOptions);

  const allowedStatuses =
    initialStatus && TASK_WORKFLOW[initialStatus] ? TASK_WORKFLOW[initialStatus] : [];

  const uniqueStatuses = Array.from(new Set([initialStatus, ...allowedStatuses].filter(Boolean)));

  const handleStatusChange = (value: string) => {
    if (value === "") {
      handleInputChange("status", "");
    } else {
      handleInputChange("status", value.toLowerCase());
    }
  };

  const handleProjectStoriesChange = (storyId: string) => {
    console.log("storyId", storyId);

    handleInputChange("story_id", storyId);
  };

  const renderStatusField = () => (
    <Grid item xs={12} sm={6}>
      <FormField
        label={transtask("labelstatus")}
        type="select"
        options={
          !initialStatus
            ? [transtask("todo")]
            : [
                "",
                ...uniqueStatuses.filter((s): s is string => s != null).map((s) => s.toUpperCase())
              ]
        }
        required
        placeholder={transtask("placeholderstatus")}
        value={!initialStatus ? transtask("todo") : currentStatus?.toUpperCase() || ""}
        onChange={!initialStatus ? undefined : (value) => handleStatusChange(String(value))}
        error={errors.status}
        disabled={!initialStatus || isReadOnly("status")}
      />
    </Grid>
  );
  const [lastLoadedProjectId, setLastLoadedProjectId] = useState("");

  if (formData.project_id && formData.project_id !== lastLoadedProjectId) {
    getStoriesByProject(formData.project_id).then((result) => {
      const storyOptions = ((result as StoryResponseWithData)?.data || []).map(
        (story: { id: string; title: string }) => ({
          id: story.id,
          name: story.title
        })
      );
      setProjectStories(storyOptions);
      setLastLoadedProjectId(formData.project_id);
    });
  }

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
        <Grid item xs={12} sm={4}>
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
        <Grid item xs={12} sm={4}>
          <FormField
            label={transtask("labelproject")}
            type="select"
            options={projectOptions}
            placeholder={transtask("placeholderproject")}
            value={formData.project_id}
            onChange={(value) => handleProjectChange(String(value))}
            error={errors.project_id}
            disabled={isReadOnly("project_id") || isProjectLocked}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transtask("labelprojectstories")}
            type="select"
            options={projectStories}
            required
            placeholder={transtask("placeholderprojectstories")}
            value={formData.story_id}
            onChange={(value) => handleProjectStoriesChange(String(value))}
            error={errors.story_id}
            disabled={isReadOnly("story_id") || isStoryLocked}
          />
        </Grid>
        {renderStatusField()}

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
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
            {transtask("labeldescription")}
          </Typography>
          <ReusableEditor
            content={formData.description || ""}
            onChange={(html) => handleInputChange("description", html)}
            placeholder={transtask("placeholderdescription")}
            readOnly={isReadOnly("description")}
            showSaveButton={false}
            userList={userList}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TaskInput;
