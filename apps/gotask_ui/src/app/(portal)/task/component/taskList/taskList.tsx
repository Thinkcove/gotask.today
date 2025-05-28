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
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";
import TaskFilters from "@/app/component/filters/taskFilters";

interface TaskListProps {
  initialView?: "projects" | "users";
}

const TaskList: React.FC<TaskListProps> = ({ initialView = "projects" }) => {
  const { canAccess } = useUserPermission();
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const [view, setView] = useState<"projects" | "users">(initialView);
  const router = useRouter();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const appendedPages = useRef<Set<string>>(new Set());
  const previousView = useRef(view);
  const scrollFrameRef = useRef<number | null>(null);

  const [page, setPage] = useState(1);
  const [allTasks, setAllTasks] = useState<IGroup[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useState<{
    search_vals?: string[][];
    search_vars?: string[][];
  }>({});

  const [minDate, setMinDate] = useState<string | undefined>();
  const [maxDate, setMaxDate] = useState<string | undefined>();
  const [dateVar, setDateVar] = useState<string>("due_date");
  const [moreDays, setMoreDays] = useState<string | undefined>();
  const [lessDays, setLessDays] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string[]>([]);
  const [projectFilter, setProjectFilter] = useState<string[]>([]);
  const [userFilter, setUserFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [variationType, setVariationType] = useState<"more" | "less" | "">("");
  const [variationDays, setVariationDays] = useState<number>(0);
  const { getAllProjects: allProjects } = useAllProjects();
  const { getAllUsers: allUsers } = useAllUsers();
  // Memoize params to avoid recomputation
  const search_vals = searchParams.search_vals;
  const search_vars = searchParams.search_vars;

  const isProjectView = view === "projects";

  const projectData = useProjectGroupTask(
    page,
    6,
    search_vals,
    search_vars,
    minDate,
    maxDate,
    dateVar,
    moreDays,
    lessDays
  );

  const userData = useUserGroupTask(
    page,
    6,
    search_vals,
    search_vars,
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

  const tasks = fetchedTasks ?? [];
  const currentTaskKey = `${view}_${page}`;

  // Append new data logic
  if (!isLoading && !appendedPages.current.has(currentTaskKey) && hasMoreData) {
    if (!tasks) return;
    const existingIds = new Set(allTasks.map((g) => g.id));
    const newTasks = tasks.filter((g: IGroup) => !existingIds.has(g.id));
    setAllTasks((prev) => [...prev, ...newTasks]);
    if (tasks.length < 6) setHasMoreData(false);
    appendedPages.current.add(currentTaskKey);
    isFetchingRef.current = false;
  }

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

  const handleSearchChange = (val: string) => {
    setSearchText(val);
    const trimmedVal = val.trim();

    const newParams = {
      ...searchParams,
      ...(trimmedVal
        ? {
            search_vals: [[trimmedVal]],
            search_vars: [["title"]]
          }
        : {
            search_vals: [],
            search_vars: []
          })
    };

    setSearchParams(newParams);
    resetTaskState();
  };

  const isSearched = searchText.trim() !== "";

  const isFiltered = () =>
    (searchParams.search_vals ?? []).some((arr) => arr.length > 0) ||
    (!!minDate && !!maxDate) ||
    !!moreDays ||
    !!lessDays;

  if (isError) {
    return (
      <Grid container spacing={3} sx={{ p: 2, mb: 8 }}>
        <Grid item xs={12}>
          <EmptyState imageSrc={TaskErrorImage} message={transtask("failedfetch")} />
        </Grid>
      </Grid>
    );
  }

  const handleViewChange = (nextView: "projects" | "users") => {
    if (nextView !== view) {
      setView(nextView);
      router.push(`/task/${nextView}`);
    }
  };

  const updateSearchParamsFromFilters = (
    status: string[],
    severity: string[],
    projects: string[],
    users: string[],
    searchTextValue: string
  ) => {
    const search_vals: string[][] = [];
    const search_vars: string[][] = [];

    if (status.length) {
      status.forEach((v) => {
        search_vals.push([v]);
        search_vars.push(["status"]);
      });
    }
    if (severity.length) {
      severity.forEach((v) => {
        search_vals.push([v]);
        search_vars.push(["severity"]);
      });
    }
    if (projects.length) {
      projects.forEach((v) => {
        search_vals.push([v]);
        search_vars.push(["project_name"]);
      });
    }
    if (users.length) {
      users.forEach((v) => {
        search_vals.push([v]);
        search_vars.push(["user_name"]);
      });
    }

    if (searchTextValue.trim()) {
      search_vals.push([searchTextValue]);
      search_vars.push(["title"]);
    }

    setSearchParams({ search_vals, search_vars });
    resetTaskState();
  };

  const handleStatusChange = (val: string[]) => {
    setStatusFilter(val);
    updateSearchParamsFromFilters(val, severityFilter, projectFilter, userFilter, searchText);
  };
  const handleSeverityChange = (val: string[]) => {
    setSeverityFilter(val);
    updateSearchParamsFromFilters(statusFilter, val, projectFilter, userFilter, searchText);
  };
  const handleProjectChange = (val: string[]) => {
    setProjectFilter(val);
    updateSearchParamsFromFilters(statusFilter, severityFilter, val, userFilter, searchText);
  };
  const handleUserChange = (val: string[]) => {
    setUserFilter(val);
    updateSearchParamsFromFilters(statusFilter, severityFilter, projectFilter, val, searchText);
  };

  const handleDateChange = (from: string, to: string) => {
    setMinDate(from || undefined);
    setMaxDate(to || undefined);
    setDateVar("due_date");

    const newParams = {
      ...searchParams,
      ...(searchText.trim()
        ? {
            search_vals: [...(searchParams.search_vals || []), [searchText]],
            search_vars: [...(searchParams.search_vars || []), ["title"]]
          }
        : {})
    };

    setSearchParams(newParams);
    resetTaskState();
  };

  const handleVariationChange = (type: "more" | "less", days: number) => {
    const more = type === "more" ? `${days}d` : undefined;
    const less = type === "less" ? `-${days}d` : undefined;

    setMoreDays(more);
    setLessDays(less);

    const newParams = {
      ...searchParams,
      ...(searchText.trim()
        ? {
            search_vals: [...(searchParams.search_vals || []), [searchText]],
            search_vars: [...(searchParams.search_vars || []), ["title"]]
          }
        : {})
    };

    setSearchParams(newParams);
    resetTaskState();
  };

  const handleViewMore = (id: string) => {
    const params = new URLSearchParams({
      view,
      ...(minDate && { minDate }),
      ...(maxDate && { maxDate }),
      ...(moreDays && { moreDays }),
      ...(lessDays && { lessDays }),
      ...((minDate || maxDate || moreDays || lessDays) && dateVar && { dateVar }),
      page: page.toString()
    });

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
          <SearchBar value={searchText} onChange={handleSearchChange} placeholder="Search Task" />
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
        onStatusChange={handleStatusChange}
        onSeverityChange={handleSeverityChange}
        onProjectChange={handleProjectChange}
        onUserChange={handleUserChange}
        onDateChange={(from, to) => {
          setDateFrom(from);
          setDateTo(to);
          handleDateChange(from, to);
        }}
        onVariationChange={(type, days) => {
          setVariationType(type);
          setVariationDays(days);
          handleVariationChange(type, days);
        }}
        onClearFilters={() => {
          setStatusFilter([]);
          setSeverityFilter([]);
          setProjectFilter([]);
          setUserFilter([]);
          updateSearchParamsFromFilters([], [], [], [], searchText);
        }}
        transtask={transtask}
      />

      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{ overflowY: "auto", height: "calc(100vh - 150px)", scrollBehavior: "smooth" }}
      >
        <Grid container spacing={3} sx={{ p: 2, mb: 8 }}>
          {allTasks.length === 0 && !isLoading && !isError && (
            <Grid item xs={12}>
              <EmptyState
                imageSrc={isFiltered() || isSearched ? NoSearchResultsImage : NoTasksImage}
                message={isFiltered() || isSearched ? "No data found" : "No tasks available"}
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
