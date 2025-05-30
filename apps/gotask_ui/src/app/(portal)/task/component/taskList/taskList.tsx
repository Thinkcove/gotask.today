"use client";

import React, { useRef, useState } from "react";
import { Grid, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  useAllProjects,
  useAllUsers,
  useProjectGroupTask,
  useUserGroupTask
} from "../../service/taskAction";
import TaskToggle from "../taskLayout/taskToggle";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";
import TaskFilters from "@/app/component/filters/taskFilters";

interface TaskListProps {
  initialView?: "projects" | "users";
}

const TaskList: React.FC<TaskListProps> = ({ initialView = "projects" }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const [searchText, setSearchText] = useState<string>(searchParams.get("title") || "");
  const [searchParamsObj, setSearchParamsObj] = useState<{
    search_vals?: string[][];
    search_vars?: string[][];
  }>({});
  const [statusFilter, setStatusFilter] = useState<string[]>(searchParams.getAll("status"));
  const [severityFilter, setSeverityFilter] = useState<string[]>(searchParams.getAll("severity"));
  const [projectFilter, setProjectFilter] = useState<string[]>(searchParams.getAll("project_name"));
  const [userFilter, setUserFilter] = useState<string[]>(searchParams.getAll("user_name"));

  const [minDate, setMinDate] = useState<string | undefined>(
    searchParams.get("minDate") || undefined
  );
  const [maxDate, setMaxDate] = useState<string | undefined>(
    searchParams.get("maxDate") || undefined
  );
  const [dateVar] = useState<string>(searchParams.get("dateVar") || "due_date");
  const [moreDays, setMoreDays] = useState<string | undefined>(
    searchParams.get("moreDays") || undefined
  );
  const [lessDays, setLessDays] = useState<string | undefined>(
    searchParams.get("lessDays") || undefined
  );
  const rawVariationType = searchParams.get("variationType");
  const [variationType, setVariationType] = useState<"more" | "less" | "">(
    rawVariationType === "more" || rawVariationType === "less" ? rawVariationType : ""
  );
  const [variationDays, setVariationDays] = useState<number>(
    Number(searchParams.get("variationDays")) || 0
  );
  const [dateFrom, setDateFrom] = useState<string>(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState<string>(searchParams.get("dateTo") || "");

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
    : { tasks: userData.tasksByUsers, isLoading: userData.isLoading, isError: userData.isError };

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

  const updateFiltersAndState = (
    updatedSearchText = searchText,
    updatedStatus = statusFilter,
    updatedSeverity = severityFilter,
    updatedProject = projectFilter,
    updatedUser = userFilter,
    updatedMinDate = minDate,
    updatedMaxDate = maxDate,
    updatedMoreDays = moreDays,
    updatedLessDays = lessDays,
    updatedVariationType = variationType,
    updatedVariationDays = variationDays,
    updatedDateFrom = dateFrom,
    updatedDateTo = dateTo
  ) => {
    const params = new URLSearchParams();

    if (updatedSearchText.trim()) params.set("title", updatedSearchText);
    updatedStatus.forEach((s) => params.append("status", s));
    updatedSeverity.forEach((s) => params.append("severity", s));
    updatedProject.forEach((p) => params.append("project_name", p));
    updatedUser.forEach((u) => params.append("user_name", u));
    if (updatedMinDate) params.set("minDate", updatedMinDate);
    if (updatedMaxDate) params.set("maxDate", updatedMaxDate);
    if ((updatedMinDate || updatedMaxDate) && dateVar) {
      params.set("dateVar", dateVar);
    }
    if (updatedMoreDays) params.set("moreDays", updatedMoreDays);
    if (updatedLessDays) params.set("lessDays", updatedLessDays);
    if (updatedVariationType) params.set("variationType", updatedVariationType);
    if (updatedVariationDays) params.set("variationDays", updatedVariationDays.toString());
    if (updatedDateFrom) params.set("dateFrom", updatedDateFrom);
    if (updatedDateTo) params.set("dateTo", updatedDateTo);

    router.replace(`?${params.toString()}`);

    const search_vals: string[][] = [];
    const search_vars: string[][] = [];

    if (updatedSearchText.trim()) {
      search_vals.push([updatedSearchText]);
      search_vars.push(["title"]);
    }
    updatedStatus.forEach((s) => {
      search_vals.push([s]);
      search_vars.push(["status"]);
    });
    updatedSeverity.forEach((s) => {
      search_vals.push([s]);
      search_vars.push(["severity"]);
    });
    updatedProject.forEach((p) => {
      search_vals.push([p]);
      search_vars.push(["project_name"]);
    });
    updatedUser.forEach((u) => {
      search_vals.push([u]);
      search_vars.push(["user_name"]);
    });

    setSearchParamsObj({ search_vals, search_vars });
    resetTaskState();
  };

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
      previousView.current = nextView;
      setView(nextView);
      resetTaskState();
      router.push(`/task/${nextView}`);
    }
  };

  const handleViewMore = (id: string) => {
    const params = new URLSearchParams({ view, page: page.toString() });
    if (minDate) params.set("minDate", minDate);
    if (maxDate) params.set("maxDate", maxDate);
    if (moreDays) params.set("moreDays", moreDays);
    if (lessDays) params.set("lessDays", lessDays);
    if ((minDate || maxDate || moreDays || lessDays) && dateVar) {
      params.set("dateVar", dateVar);
    }
    statusFilter.forEach((val) => params.append("status", val));
    severityFilter.forEach((val) => params.append("severity", val));
    if (view !== "projects") projectFilter.forEach((val) => params.append("project_name", val));
    if (view !== "users") userFilter.forEach((val) => params.append("user_name", val));
    router.push(`/task/${view}/${id}?${params.toString()}`);
  };

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

    updateFiltersAndState();
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
          <SearchBar
            value={searchText}
            onChange={(val) => {
              setSearchText(val);
              updateFiltersAndState(val);
            }}
            placeholder="Search Task"
          />
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
        onStatusChange={(vals) => {
          setStatusFilter(vals);
          updateFiltersAndState(searchText, vals);
        }}
        onSeverityChange={(vals) => {
          setSeverityFilter(vals);
          updateFiltersAndState(searchText, statusFilter, vals);
        }}
        onProjectChange={(vals) => {
          setProjectFilter(vals);
          updateFiltersAndState(searchText, statusFilter, severityFilter, vals);
        }}
        onUserChange={(vals) => {
          setUserFilter(vals);
          updateFiltersAndState(searchText, statusFilter, severityFilter, projectFilter, vals);
        }}
        onDateChange={(from, to) => {
          setDateFrom(from);
          setDateTo(to);
          setMinDate(from || undefined);
          setMaxDate(to || undefined);
          updateFiltersAndState();
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
          updateFiltersAndState("");
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
                message={isFiltered() ? "No data found" : "No tasks available"}
              />
            </Grid>
          )}

          {allTasks.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              <TaskCard
                view={view}
                group={group}
                onTaskClick={(id) => router.push(`/task/viewTask/${id}`)}
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
