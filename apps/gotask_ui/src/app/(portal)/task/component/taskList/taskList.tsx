"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Grid, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  useAllProjects,
  useAllUsers,
  useProjectGroupTask,
  useUserGroupTask
} from "../../service/taskAction";
import TaskToggle from "../taskLayout/taskToggle";
import { useRouter } from "next/navigation";
import TaskCard from "../taskLayout/taskCard";
import { IGroup, Project, User } from "../../interface/taskInterface";
import SearchBar from "@/app/component/searchBar/searchBar";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";
import NoTasksImage from "@assets/placeholderImages/notask.svg";
import TaskErrorImage from "@assets/placeholderImages/taskerror.svg";
import ActionButton from "@/app/component/floatingButton/actionButton";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import TaskFilters from "@/app/component/filters/taskFilters";
import { FILTER_STORAGE_KEY } from "@/app/common/constants/task";

interface TaskListProps {
  initialView?: "projects" | "users";
}

const TaskList: React.FC<TaskListProps> = ({ initialView = "projects" }) => {
  const router = useRouter();
  const { canAccess } = useUserPermission();
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const { getAllProjects: allProjects } = useAllProjects();
  const { getAllUsers: allUsers } = useAllUsers();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const appendedPages = useRef<Set<string>>(new Set());
  const previousView = useRef(initialView);
  const scrollFrameRef = useRef<number | null>(null);

  const [view, setView] = useState<"projects" | "users">(initialView);
  const [page, setPage] = useState(1);
  const [allTasks, setAllTasks] = useState<IGroup[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  const storedFilters =
    typeof window !== "undefined" ? localStorage.getItem(FILTER_STORAGE_KEY) : null;
  const parsedFilters = storedFilters ? JSON.parse(storedFilters) : {};

  const [searchText, setSearchText] = useState<string>(parsedFilters.searchText || "");
  const [statusFilter, setStatusFilter] = useState<string[]>(parsedFilters.statusFilter || []);
  const [severityFilter, setSeverityFilter] = useState<string[]>(
    parsedFilters.severityFilter || []
  );
  const [projectFilter, setProjectFilter] = useState<string[]>(parsedFilters.projectFilter || []);
  const [userFilter, setUserFilter] = useState<string[]>(parsedFilters.userFilter || []);
  const [minDate, setMinDate] = useState<string | undefined>(parsedFilters.minDate || undefined);
  const [maxDate, setMaxDate] = useState<string | undefined>(parsedFilters.maxDate || undefined);
  const [dateVar] = useState<string>(parsedFilters.dateVar || "due_date");
  const [moreDays, setMoreDays] = useState<string | undefined>(parsedFilters.moreDays || undefined);
  const [lessDays, setLessDays] = useState<string | undefined>(parsedFilters.lessDays || undefined);
  const [variationType, setVariationType] = useState<"more" | "less" | "">(
    parsedFilters.variationType || ""
  );
  const [variationDays, setVariationDays] = useState<number>(parsedFilters.variationDays || 0);
  const [dateFrom, setDateFrom] = useState<string>(parsedFilters.dateFrom || "");
  const [dateTo, setDateTo] = useState<string>(parsedFilters.dateTo || "");

  const [searchParamsObj, setSearchParamsObj] = useState<{
    search_vals?: string[][];
    search_vars?: string[][];
  }>({});

  const isProjectView = view === "projects";

  const projectData = useProjectGroupTask(
    page,
    6,
    searchParamsObj.search_vals,
    searchParamsObj.search_vars,
    minDate,
    maxDate,
    dateVar,
    moreDays,
    lessDays
  );

  const userData = useUserGroupTask(
    page,
    6,
    searchParamsObj.search_vals,
    searchParamsObj.search_vars,
    minDate,
    maxDate,
    dateVar,
    moreDays,
    lessDays
  );

  const {
    tasks: fetchedTasks,
    isLoading,
    isError
  } = isProjectView
    ? {
        tasks: projectData.tasksByProjects,
        isLoading: projectData.isLoading,
        isError: projectData.isError
      }
    : {
        tasks: userData.tasksByUsers,
        isLoading: userData.isLoading,
        isError: userData.isError
      };

  // Append tasks to state
  const currentTaskKey = `${view}_${page}`;
  if (!isLoading && !appendedPages.current.has(currentTaskKey) && hasMoreData && fetchedTasks) {
    const existingIds = new Set(allTasks.map((g) => g.id));
    const newTasks = fetchedTasks.filter((g: IGroup) => !existingIds.has(g.id));
    setAllTasks((prev) => [...prev, ...newTasks]);
    if (fetchedTasks.length < 6) setHasMoreData(false);
    appendedPages.current.add(currentTaskKey);
    isFetchingRef.current = false;
  }

  // Reset task data
  const resetTaskState = () => {
    setPage(1);
    setAllTasks([]);
    appendedPages.current.clear();
    setHasMoreData(true);
  };

  // Reset logic when view changes
  if (previousView.current !== view) {
    previousView.current = view;
    resetTaskState();
  }

  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams();

    if (searchText.trim()) params.set("title", searchText);
    statusFilter.forEach((s) => params.append("status", s));
    severityFilter.forEach((s) => params.append("severity", s));
    projectFilter.forEach((p) => params.append("project_name", p));
    userFilter.forEach((u) => params.append("user_name", u));
    if (minDate) params.set("minDate", minDate);
    if (maxDate) params.set("maxDate", maxDate);
    if (dateVar && (minDate || maxDate)) {
      params.set("dateVar", dateVar);
    }

    if (moreDays) params.set("moreDays", moreDays);
    if (lessDays) params.set("lessDays", lessDays);
    if (variationType) params.set("variationType", variationType);
    if (variationDays) params.set("variationDays", variationDays.toString());
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    router.replace(`?${params.toString()}`);
  }, [
    searchText,
    statusFilter,
    severityFilter,
    projectFilter,
    userFilter,
    minDate,
    maxDate,
    dateVar,
    moreDays,
    lessDays,
    variationType,
    variationDays,
    dateFrom,
    dateTo,
    router
  ]);

  useEffect(() => {
    const filtersToStore = {
      searchText,
      statusFilter,
      severityFilter,
      projectFilter,
      userFilter,
      minDate,
      maxDate,
      dateVar,
      moreDays,
      lessDays,
      variationType,
      variationDays,
      dateFrom,
      dateTo
    };
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filtersToStore));
    updateURLParams();

    const search_vals: string[][] = [];
    const search_vars: string[][] = [];

    if (searchText.trim()) {
      search_vals.push([searchText]);
      search_vars.push(["title"]);
    }
    statusFilter.forEach((s) => {
      search_vals.push([s]);
      search_vars.push(["status"]);
    });
    severityFilter.forEach((s) => {
      search_vals.push([s]);
      search_vars.push(["severity"]);
    });
    projectFilter.forEach((p) => {
      search_vals.push([p]);
      search_vars.push(["project_name"]);
    });
    userFilter.forEach((u) => {
      search_vals.push([u]);
      search_vars.push(["user_name"]);
    });

    setSearchParamsObj({ search_vals, search_vars });
    resetTaskState();
  }, [
    searchText,
    statusFilter,
    severityFilter,
    projectFilter,
    userFilter,
    minDate,
    maxDate,
    moreDays,
    lessDays,
    variationType,
    variationDays,
    dateFrom,
    dateTo,
    dateVar,
    updateURLParams
  ]);

  const handleScroll = () => {
    if (scrollFrameRef.current !== null) return;
    scrollFrameRef.current = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el || isFetchingRef.current || isLoading || !hasMoreData)
        return (scrollFrameRef.current = null);
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
      if (nearBottom) {
        isFetchingRef.current = true;
        setPage((prev) => prev + 1);
      }
      scrollFrameRef.current = null;
    });
  };

  const handleViewChange = (nextView: "projects" | "users") => {
    if (nextView !== view) {
      setView(nextView);
      router.push(`/task/${nextView}`);
    }
  };

  const handleViewMore = (id: string) => {
    const params = new URLSearchParams();

    if (searchText.trim()) params.set("title", searchText);
    if (minDate) params.set("minDate", minDate);
    if (maxDate) params.set("maxDate", maxDate);
    if (moreDays) params.set("moreDays", moreDays);
    if (lessDays) params.set("lessDays", lessDays);
    if ((minDate || maxDate || moreDays || lessDays) && dateVar) {
      params.set("dateVar", dateVar);
    }

    statusFilter.forEach((val) => params.append("status", val));
    severityFilter.forEach((val) => params.append("severity", val));
    if (view !== "projects") {
      projectFilter.forEach((val) => params.append("project_name", val));
    }
    if (view !== "users") {
      userFilter.forEach((val) => params.append("user_name", val));
    }

    router.push(`/task/${view}/${id}?${params.toString()}`);
  };

  const isFiltered = () =>
    !!statusFilter.length ||
    !!severityFilter.length ||
    !!projectFilter.length ||
    !!userFilter.length ||
    !!searchText.trim();

  if (isError) {
    return (
      <Grid container spacing={3} sx={{ p: 2, mb: 8 }}>
        <Grid item xs={12}>
          <EmptyState imageSrc={TaskErrorImage} message={transtask("failedfetch")} />
        </Grid>
      </Grid>
    );
  }
  // Define this function above the return statement
  const handleVariationChange = (type: "more" | "less" | "", days: number) => {
    setVariationType(type);
    setVariationDays(days);

    if (type === "more") {
      setMoreDays(`${days}d`);
      setLessDays(undefined);
    } else if (type === "less") {
      setLessDays(`-${days}d`);
      setMoreDays(undefined);
    } else {
      setMoreDays(undefined);
      setLessDays(undefined);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          mt: 2,
          py: 1,
          flexWrap: "nowrap"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <SearchBar value={searchText} onChange={setSearchText} placeholder="Search Task" />
        </Box>
        <TaskToggle view={view} onViewChange={handleViewChange} />
      </Box>

      <TaskFilters
        statusFilter={statusFilter}
        severityFilter={severityFilter}
        projectFilter={projectFilter}
        userFilter={userFilter}
        allProjects={allProjects.map((p: Project) => p.name)}
        allUsers={allUsers.map((u: User) => u.name)}
        variationType={variationType}
        variationDays={variationDays}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onStatusChange={setStatusFilter}
        onSeverityChange={setSeverityFilter}
        onProjectChange={setProjectFilter}
        onUserChange={setUserFilter}
        onDateChange={(from, to) => {
          setDateFrom(from);
          setDateTo(to);
          setMinDate(from || undefined);
          setMaxDate(to || undefined);
        }}
        onVariationChange={handleVariationChange}
        onClearFilters={() => {
          setStatusFilter([]);
          setSeverityFilter([]);
          setProjectFilter([]);
          setUserFilter([]);
          setSearchText("");
          setDateFrom("");
          setDateTo("");
          setMinDate(undefined);
          setMaxDate(undefined);
          setVariationType("");
          setVariationDays(0);
          setMoreDays(undefined);
          setLessDays(undefined);
          localStorage.removeItem(FILTER_STORAGE_KEY);
        }}
        transtask={transtask}
      />

      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{ overflowY: "auto", height: "calc(100vh - 150px)" }}
      >
        <Grid container spacing={3} sx={{ p: 2, mb: 8 }}>
          {allTasks.length === 0 && !isLoading && (
            <Grid item xs={12}>
              <EmptyState
                imageSrc={isFiltered() ? NoSearchResultsImage : NoTasksImage}
                message={isFiltered() ? transtask("nodata") : transtask("notask")}
              />
            </Grid>
          )}

          {allTasks.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              <TaskCard
                view={view}
                group={group}
                onTaskClick={(id) => router.push(`/task/view/${id}`)}
                onViewMore={handleViewMore}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {canAccess(APPLICATIONS.TASK, ACTIONS.CREATE) && (
        <ActionButton
          label={transtask("createtask")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={() => router.push("/task/createTask")}
        />
      )}
    </Box>
  );
};

export default TaskList;
