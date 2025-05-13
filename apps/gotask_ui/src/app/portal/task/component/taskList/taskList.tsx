import React, { useRef, useState } from "react";
import { Grid, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useProjectGroupTask, useUserGroupTask } from "../../service/taskAction";
import TaskToggle from "../taskLayout/taskToggle";
import { useRouter } from "next/navigation";
import TaskCard from "../taskLayout/taskCard";
import { IGroup, TaskFilterType } from "../../interface/taskInterface";
import ViewMoreList from "./viewMoreList";
import TaskFilterDrawer, { TaskFilterDrawerRef } from "../taskFilter/filterDrawer";
import SearchBar from "@/app/component/searchBar/searchBar";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";
import NoTasksImage from "@assets/placeholderImages/notask.svg";
import TaskErrorImage from "@assets/placeholderImages/taskerror.svg";
import TaskFilterControls from "../taskFilter/taskFilterControls";
import ActionButton from "@/app/component/floatingButton/actionButton";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";

const TaskList: React.FC = () => {
  const { canAccess } = useUserPermission();
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const [view, setView] = useState<"projects" | "users">("projects");
  const router = useRouter();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const appendedPages = useRef<Set<string>>(new Set());
  const previousView = useRef(view);
  const scrollFrameRef = useRef<number | null>(null);
  const filterDrawerRef = useRef<TaskFilterDrawerRef>(null);

  const [page, setPage] = useState(1);
  const [allTasks, setAllTasks] = useState<IGroup[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useState<{
    search_vals?: string[][];
    search_vars?: string[][];
  }>({});
  const [filtersOnly, setFiltersOnly] = useState<{
    search_vals?: string[][];
    search_vars?: string[][];
  }>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [minDate, setMinDate] = useState<string | undefined>();
  const [maxDate, setMaxDate] = useState<string | undefined>();
  const [dateVar, setDateVar] = useState<string>("due_date");
  const [moreDays, setMoreDays] = useState<string | undefined>();
  const [lessDays, setLessDays] = useState<string | undefined>();

  // Memoize params to avoid recomputation
  const search_vals = searchParams.search_vals;
  const search_vars = searchParams.search_vars;

  const isProjectView = view === "projects";

  const projectData = useProjectGroupTask(
    page,
    6,
    1,
    10,
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
    1,
    10,
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
    const newParams = {
      ...filtersOnly,
      ...(val.trim()
        ? {
            search_vals: [...(filtersOnly.search_vals || []), [val]],
            search_vars: [...(filtersOnly.search_vars || []), ["title"]]
          }
        : {})
    };
    setSearchParams(newParams);
    resetTaskState();
  };

  const handleClearAll = () => {
    setFiltersOnly({});
    setMinDate(undefined);
    setMaxDate(undefined);
    setDateVar("due_date");
    setMoreDays(undefined);
    setLessDays(undefined);
    const newParams = searchText.trim()
      ? { search_vals: [[searchText]], search_vars: [["title"]] }
      : {};
    setSearchParams(newParams);
    resetTaskState();
    filterDrawerRef.current?.resetFilters();
  };

  const isSearched = searchText.trim() !== "";
  const activeFilterCount =
    (filtersOnly.search_vals ?? []).filter((arr) => arr.length > 0).length +
    (minDate && maxDate ? 1 : 0) +
    (moreDays ? 1 : 0) +
    (lessDays ? 1 : 0);

  const isFiltered = () =>
    (filtersOnly.search_vals ?? []).some((arr) => arr.length > 0) ||
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

  const handleApplyTaskFilters = (filters: TaskFilterType) => {
    setFiltersOnly(filters);
    setMoreDays(filters.more_variation || undefined);
    setLessDays(filters.less_variation || undefined);
    setMinDate(filters.min_date || undefined);
    setMaxDate(filters.max_date || undefined);
    setDateVar(filters.date_var || "due_date");
    const newParams = {
      ...filters,
      ...(searchText.trim()
        ? {
            search_vals: [...(filters.search_vals || []), [searchText]],
            search_vars: [...(filters.search_vars || []), ["title"]]
          }
        : {})
    };
    setSearchParams(newParams);
    resetTaskState();
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
        <TaskToggle view={view} setView={setView} />
      </Box>

      <TaskFilterControls
        activeFilterCount={activeFilterCount}
        isFiltered={isFiltered()}
        onClearAll={handleClearAll}
        onOpenFilter={() => setFilterDrawerOpen(true)}
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
                onTaskClick={(id) => router.push(`/portal/task/viewTask/${id}`)}
                onViewMore={(id) => {
                  setSelectedGroupId(id);
                  setSearchParams({ search_vals: [[id]], search_vars: [["id"]] });
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {canAccess(APPLICATIONS.TASK, ACTIONS.CREATE) && (
        <ActionButton
          label={transtask("createtask")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={() => router.push("/portal/task/createTask")}
        />
      )}

      <ViewMoreList
        open={Boolean(selectedGroupId)}
        selectedGroupId={selectedGroupId}
        drawerTasks={allTasks}
        isLoadingDrawer={isLoading && page === 1}
        onClose={() => {
          setSelectedGroupId("");
          setSearchParams({});
        }}
        onTaskClick={(id) => router.push(`/portal/task/viewTask/${id}`)}
        view={view}
      />

      <TaskFilterDrawer
        ref={filterDrawerRef}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApplyFilters={handleApplyTaskFilters}
      />
    </Box>
  );
};

export default TaskList;
