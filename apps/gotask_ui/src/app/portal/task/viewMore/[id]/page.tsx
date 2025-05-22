"use client";
import { useSearchParams, useParams } from "next/navigation";
import { useProjectGroupTask, useUserGroupTask } from "../../service/taskAction";
import ViewMoreList from "../../component/taskList/viewMoreList";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import { Box, CircularProgress } from "@mui/material";

const ViewMoreAction: React.FC = () => {
  const searchParams = useSearchParams();
  const { id } = useParams();
  const view = searchParams.get("view") as "projects" | "users" | null;

  const minDate = searchParams.get("minDate") || undefined;
  const maxDate = searchParams.get("maxDate") || undefined;
  const moreDays = searchParams.get("moreDays") || undefined;
  const lessDays = searchParams.get("lessDays") || undefined;
  const dateVar = searchParams.get("dateVar") || "due_date";
  const pageStr = searchParams.get("page");
  const page = pageStr ? parseInt(pageStr) : 1;

  const filterStr = searchParams.get("filters");
  const parsedFilters = filterStr
    ? JSON.parse(decodeURIComponent(filterStr))
    : { search_vals: [], search_vars: [] };

  const search_vals: string[][] = parsedFilters.search_vals || [];
  const search_vars: string[][] = parsedFilters.search_vars || [];

  const hookArgs = [
    page,
    6,
    search_vals,
    search_vars,
    minDate,
    maxDate,
    dateVar,
    moreDays,
    lessDays
  ] as const;

  const { tasksByProjects, isLoading: isLoadingProjects } = useProjectGroupTask(...hookArgs);
  const { tasksByUsers, isLoading: isLoadingUsers } = useUserGroupTask(...hookArgs);

  if (!id || !view)
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  const drawerTasks = view === "projects" ? tasksByProjects : tasksByUsers;
  const isLoading = view === "projects" ? isLoadingProjects : isLoadingUsers;

  return (
    <>
      <ModuleHeader name="Task" />
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
