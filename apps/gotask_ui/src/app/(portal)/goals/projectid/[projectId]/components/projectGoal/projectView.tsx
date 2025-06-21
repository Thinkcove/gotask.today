import React from "react";
import { Box, Typography, Grid, IconButton, Divider, CircularProgress } from "@mui/material";
import { ArrowBack} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import LabelValueText from "@/app/component/text/labelValueText";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import { ProjectGoalViewProps } from "../../interface/projectGoal";
import GoalComments from "@/app/(portal)/goals/projectid/[projectId]/components/projectGoal/goalComments";
import { GoalComment } from "@/app/(portal)/goals/projectid/[projectId]/interface/projectGoal";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { getStatusColor } from "@/app/common/constants/project";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const ProjectGoalView: React.FC<ProjectGoalViewProps> = ({
  goalData,
  loading = false,
  handleSaveComment,
  handleEditComment,
  handleDeleteComment
}) => {
  const router = useRouter();
  const comments: GoalComment[] = goalData?.comments || [];
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);

  if (loading || !goalData) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "#f9fafb",
          border: "1px solid #e0e0e0",
          maxHeight: { xs: "auto", md: 820 },
          width: "100%",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <Box sx={{ maxHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
          <Grid container alignItems="center" mb={3}>
            <Grid item xs="auto">
              <IconButton color="primary" onClick={() => router.back()}>
                <ArrowBack />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Typography
                variant="h5"
                fontWeight={500}
                sx={{ textTransform: "capitalize", fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              >
                {goalData.goalTitle}
              </Typography>
              <StatusIndicator status={goalData.status} getColor={getStatusColor} />
            </Grid>
          </Grid>

          {/* Description */}
          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              {transGoal("description")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word"
              }}
            >
              {goalData.description || "-"}
            </Typography>
          </Box>

          {/* Meta Info */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText label="Priority" value={goalData.priority || "-"} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText
                label="Created"
                value={<FormattedDateTime date={goalData.createdAt} />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText
                label="Updated"
                value={<FormattedDateTime date={goalData.updatedAt} />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText
                label="Week Start"
                value={<FormattedDateTime date={goalData.weekStart} />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText
                label="Week End"
                value={<FormattedDateTime date={goalData.weekEnd} />}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mt: 2, mb: 3 }} />

          <Box>
            <Typography variant="subtitle1" fontWeight={500} mb={1}>
              {transGoal("comment")}
            </Typography>

            <GoalComments
              comments={comments}
              onSave={handleSaveComment}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              goalId={goalData.id?.toString() || ""} // Add this
              currentUserId={""} // Replace with actual current user ID
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectGoalView;
