import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, IconButton, Divider, CircularProgress } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import LabelValueText from "@/app/component/text/labelValueText";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import { ProjectGoalViewProps } from "../../interface/projectGoal";
import GoalComments from "@/app/(portal)/goals/projectid/[projectId]/components/projectGoal/goalComments";
import { GoalComment } from "@/app/(portal)/goals/projectid/[projectId]/interface/projectGoal";
import {
  createComment,
  deleteComment,
  getCommentsByGoalId,
  updateComment
} from "@/app/(portal)/goals/service/projectGoalAction";
// Adjust the import path as needed

const ProjectGoalView: React.FC<ProjectGoalViewProps> = ({ goalData, loading = false }) => {
  const router = useRouter();
  const [comments, setComments] = useState<GoalComment[]>(goalData?.comments || []);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Load comments when component mounts or goalData changes
  useEffect(() => {
    if (goalData?.id) {
      loadComments();
    }
  }, [goalData?.id]);

  const loadComments = async () => {
    if (!goalData?.id) return;

    try {
      setCommentsLoading(true);
      const fetchedComments = await getCommentsByGoalId(goalData.id.toString());
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      // Optionally show a toast notification for error
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSaveComment = async (commentText: string) => {
    if (!goalData?.id) return;

    try {
      const commentData = {
        goal_id: goalData.id.toString(),
        comment: commentText,
        user_id: "your-current-user-id" // Replace with actual current user ID
      };

      const response = await createComment(commentData);

      // Add the new comment to local state
      const newComment: GoalComment = {
        id: response.data?.id || Date.now(),
        comment: commentText,
        user_name: "Current User", // Replace with actual current user name
        user_id: "your-current-user-id",
        updatedAt: new Date().toISOString()
      };

      setComments((prev) => [...prev, newComment]);

      // Optionally show success message
      console.log("Comment created successfully");
    } catch (error) {
      console.error("Error creating comment:", error);
      // Optionally show error toast notification
    }
  };
  const handleBack = () => {
    router.back();
  };
  const handleEditComment = async (id: number | string, updatedCommentText: string) => {
    try {
      await updateComment(id, { comment: updatedCommentText });

      // Update local state
      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, comment: updatedCommentText, updatedAt: new Date().toISOString() }
            : c
        )
      );

      // Optionally show success message
      console.log("Comment updated successfully");
    } catch (error) {
      console.error("Error updating comment:", error);
      // Optionally show error toast notification
    }
  };

  const handleDeleteComment = async (id: number | string) => {
    try {
      await deleteComment(id);

      // Remove from local state
      setComments((prev) => prev.filter((c) => c.id !== id));

      // Optionally show success message
      console.log("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      // Optionally show error toast notification
    }
  };

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
    <Box sx={{ minHeight: "100vh", p: { xs: 1, sm: 2, md: 3 } }}>
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
        <Grid container spacing={2} alignItems="center" mb={3}>
          <IconButton color="primary" onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Grid item xs>
            <Typography
              variant="h5"
              fontWeight={500}
              sx={{ textTransform: "capitalize", fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
            >
              {goalData.goalTitle}
            </Typography>
            <Typography variant="subtitle2" color="primary">
              {goalData.status}
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <IconButton
              color="primary"
              onClick={() => router.push(`/project/goals/edit/${goalData.id}`)}
            >
              <Edit />
            </IconButton>
          </Grid>
        </Grid>

        {/* Description */}
        <Box mb={3}>
          <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
            Description
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

        {/* Comments Section with Add/Edit/Delete */}
        <Box>
          <Typography variant="subtitle1" fontWeight={500} mb={1}>
            Comments
          </Typography>

          {commentsLoading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <GoalComments
              comments={comments}
              onSave={handleSaveComment}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              currentUserId={""}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectGoalView;
