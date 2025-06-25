"use client";

import { Box, Typography, Grid, IconButton, CircularProgress, Paper } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/header/moduleHeader";
import LabelValueText from "@/app/component/text/labelValueText";
import { useIssuesById } from "../../services/assetActions";

const ViewIssue: React.FC<{ id: string }> = ({ id }) => {
  const trans = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const router = useRouter();
  const { asset: issue, isLoading } = useIssuesById(id);
  if (isLoading) {
    return (
      <>
        <ModuleHeader name={trans("issues")} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh"
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!issue) return null;

  return (
    <>
      <ModuleHeader name={trans("issues")} />
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)",
          minHeight: "100vh"
        }}
      >
        <Paper sx={{ p: 4, borderRadius: 4, border: "1px solid #e0e0e0" }}>
          {/* Header */}
          <Grid container alignItems="center" spacing={2} mb={3}>
            <Grid item>
              <IconButton color="primary" onClick={() => router.back()}>
                <ArrowBack />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Typography variant="h5">{issue.issueType}</Typography>
            </Grid>
            <Grid item xs="auto">
              <IconButton
                color="primary"
                onClick={() => router.push(`/asset/editIssues/${issue.id}`)}
              >
                <Edit />
              </IconButton>
            </Grid>
          </Grid>

          {/* Description */}
          <Grid item xs={12} sm={6} md={4} mb={2}>
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              {trans("description")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.primary", lineHeight: 1.6, whiteSpace: "pre-wrap" }}
            >
              {issue.description || "-"}
            </Typography>
          </Grid>

          {/* Fields */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText label={trans("status")} value={issue.status || "-"} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText label={trans("reportedby")} value={issue.reportedUser || "-"} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText label={trans("assignedTo")} value={issue.assignedUser || "-"} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText label={trans("assets")} value={issue.asset || "-"} />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default ViewIssue;
