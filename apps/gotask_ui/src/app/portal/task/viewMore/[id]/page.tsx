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

  const { tasksByProjects, isLoading: isLoadingProjects } = useProjectGroupTask(
    1,
    6,
    1,
    10,
    [[id as string]],
    [["id"]]
  );
  const { tasksByUsers, isLoading: isLoadingUsers } = useUserGroupTask(
    1,
    6,
    1,
    10,
    [[id as string]],
    [["id"]]
  );

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
      <ModuleHeader name="View More Tasks" />
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
