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
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import TaskFilters from "../../component/taskFilter/taskFilter";
import { IGroup, Project, User } from "../../interface/taskInterface";
import ViewMoreList from "../../component/taskList/viewMoreList";
import ViewMoreHeader from "../../component/taskList/viewMoreHeader";

const safeParseArrayParam = (param: string | null): string[] => {
  try {
    if (!param) return [];
    const parsed = JSON.parse(param);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

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

  const filterStr = searchParams.get("filters");
  const parsedFilters = filterStr
    ? JSON.parse(decodeURIComponent(filterStr))
    : { search_vals: [], search_vars: [] };

  const search_vals: string[][] = parsedFilters.search_vals || [];
  const search_vars: string[][] = parsedFilters.search_vars || [];

  const statusFilter = safeParseArrayParam(searchParams.get("status"));
  const severityFilter = safeParseArrayParam(searchParams.get("severity"));
  const projectFilter = safeParseArrayParam(searchParams.get("projects"));
  const userFilter = safeParseArrayParam(searchParams.get("users"));

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

  const updateQueryParam = (key: string, value: string | string[] | undefined) => {
    const params = new URLSearchParams(window.location.search);

    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, JSON.stringify(value));
      } else {
        params.delete(key);
      }
    } else if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
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
    const search_vals: string[][] = [];
    const search_vars: string[][] = [];

    status.forEach((v) => {
      search_vals.push([v]);
      search_vars.push(["status"]);
    });

    severity.forEach((v) => {
      search_vals.push([v]);
      search_vars.push(["severity"]);
    });

    projects.forEach((v) => {
      search_vals.push([v]);
      search_vars.push(["project_name"]);
    });

    users.forEach((v) => {
      search_vals.push([v]);
      search_vars.push(["user_name"]);
    });

    updateQueryParam("filters", encodeURIComponent(JSON.stringify({ search_vals, search_vars })));
    updateQueryParam("status", status);
    updateQueryParam("severity", severity);
    updateQueryParam("projects", projects);
    updateQueryParam("users", users);
  };

  const clearAllFilters = () => {
    [
      "filters",
      "status",
      "severity",
      "projects",
      "users",
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
  const name = `List view of ${
    drawerTasks.find((group: IGroup) => group.id === id)?.[
      view === "projects" ? "project_name" : "user_name"
    ] ?? ""
  } ${view === "projects" ? "Project" : "User"}`;

  return (
    <>
      <ModuleHeader name="Task" />

      <ViewMoreHeader name={name} onClose={() => window.history.back()} />
      <Box sx={{ pt: 2 }}>
        <TaskFilters
          statusFilter={statusFilter}
          severityFilter={severityFilter}
          projectFilter={projectFilter}
          hideProjectFilter={hideProjectFilter}
          userFilter={userFilter}
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
        onClose={() => window.history.back()}
        onTaskClick={(taskId) => (window.location.href = `/portal/task/viewTask/${taskId}`)}
        view={view}
      />
    </>
  );
};

export default ViewMoreAction;
