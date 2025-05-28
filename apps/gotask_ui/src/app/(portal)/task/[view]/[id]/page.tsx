"use client";

import { Box, CircularProgress } from "@mui/material";
import { useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import {
  useAllProjects,
  useAllUsers,
  useProjectGroupTask,
  useUserGroupTask
} from "../../service/taskAction";
import { IGroup, Project, User } from "../../interface/taskInterface";
import ModuleHeader from "@/app/component/header/moduleHeader";
import PageHeader from "@/app/component/header/pageHeader";
import TaskFilters from "@/app/component/filters/taskFilters";
import ViewMoreList from "../../component/taskList/viewMoreList";

const ViewMoreAction: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);

  const view = searchParams.get("view") as "projects" | "users" | null;
  const minDate = searchParams.get("minDate") || "";
  const maxDate = searchParams.get("maxDate") || "";
  const moreDays = searchParams.get("moreDays") || "";
  const lessDays = searchParams.get("lessDays") || "";
  const dateVar = searchParams.get("dateVar") || "due_date";
  const page = parseInt(searchParams.get("page") || "1");

  const getArrayParam = (name: string): string[] => {
    const values = searchParams.getAll(name);
    return values.filter(Boolean);
  };

  const statusFilter = getArrayParam("status");
  const severityFilter = getArrayParam("severity");
  const projectFilter = getArrayParam("project_name");
  const userFilter = getArrayParam("user_name");

  const { search_vals, search_vars } = useMemo(() => {
    const vals: string[][] = [];
    const vars: string[][] = [];

    statusFilter.forEach((v) => {
      vals.push([v]);
      vars.push(["status"]);
    });

    severityFilter.forEach((v) => {
      vals.push([v]);
      vars.push(["severity"]);
    });

    projectFilter.forEach((v) => {
      vals.push([v]);
      vars.push(["project_name"]);
    });

    userFilter.forEach((v) => {
      vals.push([v]);
      vars.push(["user_name"]);
    });

    return { search_vals: vals, search_vars: vars };
  }, [statusFilter, severityFilter, projectFilter, userFilter]);

  const variationType = moreDays ? "more" : lessDays ? "less" : "";
  const variationDays = moreDays
    ? parseInt(moreDays)
    : lessDays
      ? parseInt(lessDays.replace("-", ""))
      : 0;

  const { getAllProjects: allProjects } = useAllProjects();
  const { getAllUsers: allUsers } = useAllUsers();

  const hookArgs = useMemo(
    () =>
      [
        page,
        6,
        search_vals,
        search_vars,
        minDate || undefined,
        maxDate || undefined,
        dateVar,
        moreDays || undefined,
        lessDays || undefined
      ] as const,
    [page, search_vals, search_vars, minDate, maxDate, dateVar, moreDays, lessDays]
  );

  const { tasksByProjects, isLoading: isLoadingProjects } = useProjectGroupTask(...hookArgs);
  const { tasksByUsers, isLoading: isLoadingUsers } = useUserGroupTask(...hookArgs);

  const drawerTasks = view === "projects" ? tasksByProjects : tasksByUsers;
  const isLoading = view === "projects" ? isLoadingProjects : isLoadingUsers;

  const updateQueryParam = (key: string, value: string[] | string | undefined) => {
    const params = new URLSearchParams(window.location.search);

    params.delete(key);

    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value) {
      params.set(key, value);
    }

    window.history.replaceState(null, "", `?${params.toString()}`);
    router.refresh();
  };

  const updateDateRange = (from: string, to: string) => {
    updateQueryParam("minDate", from);
    updateQueryParam("maxDate", to);
  };

  const updateVariation = (type: "more" | "less", days: number) => {
    if (type === "more") {
      updateQueryParam("moreDays", `${days}`);
      updateQueryParam("lessDays", undefined);
    } else {
      updateQueryParam("lessDays", `-${days}`);
      updateQueryParam("moreDays", undefined);
    }
  };

  const updateSearchFilters = (
    status: string[],
    severity: string[],
    projects: string[],
    users: string[]
  ) => {
    updateQueryParam("status", status);
    updateQueryParam("severity", severity);
    updateQueryParam("project_name", projects);
    updateQueryParam("user_name", users);
  };

  const clearAllFilters = () => {
    [
      "status",
      "severity",
      "project_name",
      "user_name",
      "minDate",
      "maxDate",
      "moreDays",
      "lessDays"
    ].forEach((key) => updateQueryParam(key, undefined));
  };

  if (!id || !view) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const hideProjectFilter = view === "projects";
  const hideUserFilter = view !== "projects";

  const name = `List view of ${
    drawerTasks.find((group: IGroup) => group.id === id)?.[
      view === "projects" ? "project_name" : "user_name"
    ] ?? ""
  } ${view === "projects" ? "Project" : "User"}`;

  return (
    <>
      <ModuleHeader name="Task" />
      <PageHeader name={name} onClose={() => window.history.back()} />
      <Box sx={{ pt: 2 }}>
        <TaskFilters
          statusFilter={statusFilter}
          severityFilter={severityFilter}
          projectFilter={projectFilter}
          userFilter={userFilter}
          hideProjectFilter={hideProjectFilter}
          hideUserFilter={hideUserFilter}
          allProjects={allProjects.map((p: Project) => p.name)}
          allUsers={allUsers.map((u: User) => u.name)}
          variationType={variationType}
          variationDays={variationDays}
          dateFrom={minDate}
          dateTo={maxDate}
          onStatusChange={(val) =>
            updateSearchFilters(val, severityFilter, projectFilter, userFilter)
          }
          onSeverityChange={(val) =>
            updateSearchFilters(statusFilter, val, projectFilter, userFilter)
          }
          onProjectChange={(val) =>
            updateSearchFilters(statusFilter, severityFilter, val, userFilter)
          }
          onUserChange={(val) =>
            updateSearchFilters(statusFilter, severityFilter, projectFilter, val)
          }
          onDateChange={updateDateRange}
          onVariationChange={updateVariation}
          onClearFilters={clearAllFilters}
          transtask={transtask}
        />
      </Box>
      <ViewMoreList
        selectedGroupId={id as string}
        drawerTasks={drawerTasks}
        isLoadingDrawer={isLoading && !drawerTasks?.length}
        onTaskClick={(taskId) => (window.location.href = `/task/viewTask/${taskId}`)}
        view={view}
      />
    </>
  );
};

export default ViewMoreAction;
