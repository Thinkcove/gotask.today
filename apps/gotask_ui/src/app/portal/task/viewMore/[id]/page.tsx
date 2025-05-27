"use client";

import { Box, CircularProgress } from "@mui/material";
import { useMemo } from "react";
import { useParams } from "next/navigation";
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
import { useTaskFilters } from "@/app/taskFilterContext";

const ViewMoreAction: React.FC = () => {
  const { id } = useParams();
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const { filters, setFilters, clearFilters } = useTaskFilters();

  const {
    view,
    minDate = "",
    maxDate = "",
    moreDays = "",
    lessDays = "",
    dateVar = "due_date",
    page = 1,
    statusFilter = [],
    severityFilter = [],
    projectFilter = [],
    userFilter = []
  } = filters;

  // Wrap search_vals and search_vars inside useMemo to avoid re-creating arrays on every render
  const [search_vals, search_vars] = useMemo(() => {
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

    return [vals, vars];
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
      <ViewMoreHeader name={name} onClose={() => window.history.back()} />
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
          onStatusChange={(val) => setFilters({ ...filters, statusFilter: val })}
          onSeverityChange={(val) => setFilters({ ...filters, severityFilter: val })}
          onProjectChange={(val) => setFilters({ ...filters, projectFilter: val })}
          onUserChange={(val) => setFilters({ ...filters, userFilter: val })}
          onDateChange={(from, to) => setFilters({ ...filters, minDate: from, maxDate: to })}
          onVariationChange={(type, days) =>
            setFilters({
              ...filters,
              moreDays: type === "more" ? `${days}` : "",
              lessDays: type === "less" ? `-${days}` : ""
            })
          }
          onClearFilters={clearFilters}
          transtask={transtask}
        />
      </Box>
      <ViewMoreList
        selectedGroupId={id as string}
        drawerTasks={drawerTasks}
        isLoadingDrawer={isLoading && !drawerTasks?.length}
        onTaskClick={(taskId) => (window.location.href = `/portal/task/viewTask/${taskId}`)}
        view={view}
      />
    </>
  );
};

export default ViewMoreAction;
