import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, IconButton, Button, Divider, Stack } from "@mui/material";
import { ArrowBack, Delete, Edit } from "@mui/icons-material";
import { Project } from "../../interfaces/projectInterface";
import { useAllUsers } from "@/app/(portal)/task/service/taskAction";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import FormField, { SelectOption } from "@/app/component/input/formField";
import { useParams, useRouter } from "next/navigation";
import {
  assignUsersToProject,
  createWeeklyGoal,
  fetchWeeklyGoals,
  removeUsersFromProject,
  updateWeeklyGoal
} from "../../services/projectAction";
import useSWR, { KeyedMutator } from "swr";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { getStatusColor } from "@/app/common/constants/task";
import EditProject from "./editProject";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import LabelValueText from "@/app/component/text/labelValueText";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import { useUserPermission } from "@/app/common/utils/userPermission";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import WeeklyGoals, { WeeklyGoal } from "./weeklyGoal/weeklyGoals";
import WeeklyGoalForm from "./weeklyGoal/weeklyGoalForm";
import TaskToggle from "@/app/component/toggle/toggle";

interface ProjectDetailProps {
  project: Project;
  mutate: KeyedMutator<Project>;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, mutate }) => {
  const { canAccess } = useUserPermission();
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const { data: weeklyGoals, error, isLoading } = useSWR("weekly-goals", fetchWeeklyGoals);
  useEffect(() => {
    if (weeklyGoals) {
      console.log("Fetched Weekly Goals:", weeklyGoals);
    }
    if (error) {
      console.error("Error fetching weekly goals:", error);
    }
  }, [weeklyGoals, error]);
  const [open, setOpen] = useState(false);
  const [goalData, setGoalData] = useState<any>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // state for the delete confirmation dialog
  const router = useRouter();
  const handleBack = () => {
    setTimeout(() => router.back(), 2000);
  };
  const [editOpen, setEditOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const { getAllUsers } = useAllUsers();
  const assignedUserIds = project.users.map((user) => user.id);
  const unassignedUsers = getAllUsers.filter(
    (user: SelectOption) => !assignedUserIds.includes(user.id)
  );
  const { projectId } = useParams();
  const projectID = projectId as string;
  const handleAddUser = async () => {
    setOpen(false);
    try {
      const response = await assignUsersToProject(selectedUserIds, projectID);
      await mutate();
      setSelectedUserIds([]);
      setSnackbar({
        open: true,
        message: response.message,
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
    } catch {
      setSnackbar({
        open: true,
        message: transproject("erroradd"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };
  const onClose = () => {
    setSelectedUserIds([]);
    setOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedUserId) return; // If no user selected, do nothing
    try {
      const response = await removeUsersFromProject([selectedUserId], projectID); // send array with 1 id
      await mutate();
      setOpenDeleteDialog(false);
      setSelectedUserId(null); // clear after deletion
      setSnackbar({
        open: true,
        message: response.message,
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
    } catch {
      setSnackbar({
        open: true,
        message: transproject("errorremove"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };
  const formatStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "not-started":
        return "Not Started";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "blocked":
        return "Blocked";
      default:
        return "Unknown";
    }
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [editGoal, setEditGoal] = useState<WeeklyGoal | null>(null);
  console.log("editGoal", editGoal);
  const handelOpen = () => {
    setGoalData({
      goalTitle: "",
      projectId: projectID,
      status: "",
      description: "",
      comments: "",
      priority: ""
    });
    setOpenDialog(true);
  };
  const handleEditGoal = (goal: WeeklyGoal) => {
    setEditGoal(goal);
    setGoalData(goal);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        projectId: goalData.projectId,
        goalTitle: goalData.goalTitle,
        weekStart: goalData.weekStart,
        weekEnd: goalData.weekEnd,
        status: goalData.status,
        description: goalData.description,
        comments: goalData.comments,
        priority: goalData.priority
      };

      if (goalData.id) {
        // Edit mode
        await updateWeeklyGoal(goalData.id, payload);
      } else {
        // Create mode
        await createWeeklyGoal(payload);
      }

      // Optional: refresh goal list here
      setOpenDialog(false); // Close dialog
    } catch (err) {
      console.error("Error saving weekly goal:", err);
    }
  };
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const [selectedView, setSelectedView] = useState("Asset");

  return (
    <>
      <ModuleHeader name={transproject("detailview")} />

      <Box
        sx={{
          minHeight: "100vh",
          p: 3,
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        {openDialog ? (
          <Box
            sx={{
              mt: 3,
              p: 3,
              border: "1px solid #ccc",
              borderRadius: 2,
              backgroundColor: "#f9f9f9"
            }}
          >
            <Typography variant="h6" mb={2}>
              {goalData.id ? "Edit Weekly Goal" : "Create Weekly Goal"}
            </Typography>

            <WeeklyGoalForm goalData={goalData} setGoalData={setGoalData} />

            <Box mt={2} display="flex" gap={2}>
              <Button variant="outlined" color="secondary" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button variant="outlined" color="primary" onClick={handleSubmit}>
                {goalData.id ? "Update" : "Create"}
              </Button>
            </Box>
          </Box>
        ) : (
          // Begin main content when not creating a weekly goal
          <Box
            sx={{
              borderRadius: 4,
              p: 4,
              bgcolor: "#f9fafb",
              border: "1px solid #e0e0e0"
            }}
          >
            {/* Project Header */}
            <Box display="flex" alignItems="center" mb={3}>
              <IconButton color="primary" onClick={handleBack} sx={{ mr: 2 }}>
                <ArrowBack />
              </IconButton>
              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="h4" fontWeight={700} sx={{ textTransform: "capitalize" }}>
                    {project.name}
                  </Typography>
                  <StatusIndicator status={project.status} getColor={getStatusColor} />
                </Box>
                {canAccess(APPLICATIONS.PROJECT, ACTIONS.UPDATE) && (
                  <IconButton edge="start" color="primary" onClick={() => setEditOpen(true)}>
                    <Edit />
                  </IconButton>
                )}
              </Box>
            </Box>

            {/* Basic Details */}
            <Grid container spacing={2} flexDirection="column" mb={2}>
              <Grid item xs={12} md={6}>
                <LabelValueText
                  label={transproject("detaildescription")}
                  value={project.description}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText
                  label={transproject("detailcreatedon")}
                  value={project.createdAt ? <FormattedDateTime date={project.createdAt} /> : "-"}
                />
              </Grid>
              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText
                  label={transproject("detailupdateon")}
                  value={project.updatedAt ? <FormattedDateTime date={project.updatedAt} /> : "-"}
                />
              </Grid>
            </Grid>
            <Divider sx={{ mb: 4 }} />
            <TaskToggle
              options={[transproject("goal"), transproject("assignee")]}
              selected={selectedView}
              onChange={setSelectedView}
            />
            {/* Weekly Goals */}
            <WeeklyGoals
              weeklyGoals={weeklyGoals || []}
              isLoading={isLoading}
              error={!!error}
              formatStatus={formatStatus}
              handelOpen={handelOpen}
              openDialog={openDialog}
              handleEditGoal={handleEditGoal}
              projectId={Array.isArray(projectId) ? projectId[0] : (projectId ?? "")}
            />

            {/* Assignees */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" fontWeight={600}>
                {transproject("detailassignee")}
              </Typography>
              {canAccess(APPLICATIONS.PROJECT, ACTIONS.ASSIGN) && (
                <Button
                  variant="contained"
                  onClick={() => setOpen(true)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2
                  }}
                >
                  {transproject("detailaddassignee")}
                </Button>
              )}
            </Box>

            {/* Users Grid */}
            <Grid container spacing={3} sx={{ maxHeight: "500px", overflowY: "auto" }}>
              {project.users.length > 0 ? (
                project.users.map((user) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "#ffffff",
                        border: "1px solid #e0e0e0",
                        overflow: "hidden",
                        flexWrap: "wrap"
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ minWidth: 0, flex: 1 }}
                      >
                        <AlphabetAvatar userName={user.name} size={44} fontSize={16} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            fontWeight={600}
                            fontSize="1rem"
                            sx={{
                              textTransform: "capitalize",
                              wordBreak: "break-word",
                              maxWidth: 200
                            }}
                          >
                            {user.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ wordBreak: "break-word", maxWidth: 200 }}
                          >
                            {user.user_id}
                          </Typography>
                        </Box>
                      </Stack>

                      {canAccess(APPLICATIONS.PROJECT, ACTIONS.UNASSIGN) && (
                        <Box sx={{ flexShrink: 0 }}>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setOpenDeleteDialog(true);
                            }}
                            sx={{
                              transition: "0.2s ease",
                              "&:hover": {
                                transform: "scale(1.1)"
                              }
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography color="text.secondary">{transproject("detailnouser")}</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Add User Dialog */}
        <CommonDialog
          open={open}
          onClose={onClose}
          onSubmit={handleAddUser}
          title={transproject("addassignetitle")}
          submitLabel={transproject("addusertitle")}
        >
          <FormField
            label={transproject("labelassignee")}
            type="multiselect"
            placeholder={transproject("placeholdeselect")}
            options={unassignedUsers}
            value={selectedUserIds}
            onChange={(ids) => setSelectedUserIds(ids as string[])}
          />
        </CommonDialog>

        {/* Edit Project */}
        <EditProject
          open={editOpen}
          onClose={() => setEditOpen(false)}
          data={project}
          mutate={mutate}
          projectID={projectID}
        />

        {/* Delete User Dialog */}
        <CommonDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onSubmit={handleDelete}
          title={transproject("titledelete")}
          submitLabel={transproject("labeldelete")}
        >
          <Typography>
            {transproject("removeuserconfirmation")}
            <br />
            {transproject("removeusernote1")}
            <br />
            {transproject("removeusernote2")}
          </Typography>
        </CommonDialog>

        {/* Snackbar */}
        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Box>
    </>
  );
};
export default ProjectDetail;
