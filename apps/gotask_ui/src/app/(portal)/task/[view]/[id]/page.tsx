"use client";
import { Box, CircularProgress, Grid, Divider } from "@mui/material";
import { useMemo, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import {
  useAllProjects,
  useAllUsers,
  useProjectGroupTask,
  useUserGroupTask
} from "../../service/taskAction";
import { Project, User } from "../../interface/taskInterface";
import ModuleHeader from "@/app/component/header/moduleHeader";
import PageHeader from "@/app/component/header/pageHeader";
import TaskFilters from "@/app/component/filters/taskFilters";
import ViewMoreList from "../../component/taskList/viewMoreList";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import ActionButton from "@/app/component/floatingButton/actionButton";
import { Add } from "@mui/icons-material";
import SearchBar from "@/app/component/searchBar/searchBar";

const ViewMoreAction: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const { canAccess } = useUserPermission();
  const pathname = usePathname();
  const view = pathname.includes("/task/project")
    ? "projects"
    : pathname.includes("/task/user")
      ? "users"
      : null;
  const minDate = searchParams.get("minDate") || "";
  const maxDate = searchParams.get("maxDate") || "";
  const moreDays = searchParams.get("moreDays") || "";
  const lessDays = searchParams.get("lessDays") || "";
  const dateVar = searchParams.get("dateVar") || "due_date";
  const title = searchParams.get("title") || "";

  const [searchText, setSearchText] = useState<string>(title);
  const getArrayParam = (name: string): string[] => {
    return searchParams.getAll(name).filter(Boolean);
  };

  const statusFilter = getArrayParam("status");
  const severityFilter = getArrayParam("severity");
  const projectFilter = getArrayParam("project_name");
  const userFilter = getArrayParam("user_name");
  const variationType = moreDays ? "more" : lessDays ? "less" : "";
  const variationDays = useMemo(() => {
    if (moreDays) return parseInt(moreDays);
    if (lessDays) return parseInt(lessDays.replace("-", ""));
    return 0;
  }, [moreDays, lessDays]);
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

    if (id) {
      vals.push([id as string]);
      vars.push(["id"]);
    }

    if (title.trim()) {
      vals.push([title]);
      vars.push(["title"]);
    }

    return { search_vals: vals, search_vars: vars };
  }, [statusFilter, severityFilter, projectFilter, userFilter, id, title]);

  const { getAllProjects: allProjects } = useAllProjects();
  const { getAllUsers: allUsers } = useAllUsers();

  const hookArgs = useMemo(
    () =>
      [
        1,
        6,
        search_vals,
        search_vars,
        minDate || undefined,
        maxDate || undefined,
        dateVar,
        moreDays || undefined,
        lessDays || undefined
      ] as const,
    [search_vals, search_vars, minDate, maxDate, dateVar, moreDays, lessDays]
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

  const updateVariation = (type: "" | "more" | "less", days: number) => {
    if (type === "more") {
      updateQueryParam("moreDays", `${days}`);
      updateQueryParam("lessDays", undefined);
    } else if (type === "less") {
      updateQueryParam("lessDays", `-${days}`);
      updateQueryParam("moreDays", undefined);
    } else {
      updateQueryParam("moreDays", undefined);
      updateQueryParam("lessDays", undefined);
    }
  };

  const updateSearchText = (val: string) => {
    setSearchText(val);
    updateQueryParam("title", val);
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

  const groupName = useMemo(() => {
    if (view === "projects") {
      return allProjects.find((p: Project) => p.id === id)?.name || "";
    }
    if (view === "users") {
      return allUsers.find((u: User) => u.id === id)?.name || "";
    }
    return "";
  }, [view, id, allProjects, allUsers]);

  if (!id || !view) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }
  const name = groupName;
  const hideProjectFilter = view === "projects";
  const hideUserFilter = view !== "projects";

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" overflow="hidden">
      <ModuleHeader name={name} />

      {/* Search + Filters Row (responsive) */}
      <Box
        mt={2}
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "flex-start" }}
      >
        {/* Search and Header */}
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          flexWrap="wrap"
          minWidth={{ xs: "100%", md: 200 }}
        >
          <Box sx={{ mr: 2, mt: 2 }}>
            <PageHeader onClose={() => window.history.back()} />
          </Box>
          <Box maxWidth={350} flex={1} mt={2}>
            <SearchBar
              value={searchText}
              onChange={updateSearchText}
              sx={{ width: "100%" }}
              placeholder="Search Task"
            />
          </Box>
        </Box>

        {/* Filters: Full width on small screens */}
        <Box flex={1} minWidth={280} width={{ xs: "100%", md: "auto" }}>
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
            onDateChange={(from, to) => updateDateRange(from, to)}
            onVariationChange={(type, days) => updateVariation(type, days)}
            onClearFilters={clearAllFilters}
            transtask={transtask}
          />
        </Box>
      </Box>

      {/* Task List or Empty State */}
      <Box flex={1} overflow="auto" minHeight="100%" display="flex" flexDirection="column">
        {!isLoading && drawerTasks.length === 0 ? (
          <Grid
            container
            sx={{ flex: 1, minHeight: "100%" }}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <EmptyState
                imageSrc={NoSearchResultsImage}
                message={transtask("notaskfound", { name: groupName })}
              />
            </Grid>
          </Grid>
        ) : (
          <ViewMoreList
            selectedGroupId={id as string}
            drawerTasks={drawerTasks}
            isLoadingDrawer={isLoading && !drawerTasks?.length}
            onTaskClick={(taskId) => (window.location.href = `/task/view/${taskId}`)}
            view={view}
          />
        )}
      </Box>

      {/* Floating Create Task Button */}
      {canAccess(APPLICATIONS.TASK, ACTIONS.CREATE) && (
        <ActionButton
          label={transtask("createtask")}
          icon={<Add sx={{ color: "white" }} />}
          onClick={() => router.push("/task/createTask")}
        />
      )}
    </Box>
  );
};

export default ViewMoreAction;
