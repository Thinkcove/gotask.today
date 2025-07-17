"use client";

import { Box, Typography, Grid, IconButton, CircularProgress, Paper } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/header/moduleHeader";
import LabelValueText from "@/app/component/text/labelValueText";
import { useIssuesById } from "../../services/assetActions";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { getIssuesStatusColor } from "@/app/common/constants/asset";
import { RichTextReadOnly } from "mui-tiptap";
import { getTipTapExtensions } from "@/app/common/utils/textEditor";

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
          p: { xs: 1, sm: 3 },
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)",
          height: "calc(100vh - 64px)",
          overflowY: "auto"
        }}
      >
        <Paper
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 4,
            border: "1px solid #e0e0e0",
            maxWidth: "100%",
            boxSizing: "border-box"
          }}
        >
          {/* Header */}
          <Grid container alignItems="center" spacing={2} mb={3}>
            <Grid item>
              <IconButton color="primary" onClick={() => router.back()}>
                <ArrowBack />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 0.5,
                    fontSize: { xs: "1.25rem", sm: "1.5rem" }
                  }}
                >
                  {issue.issueType}
                </Typography>
                {issue.status && (
                  <StatusIndicator status={issue.status} getColor={getIssuesStatusColor} />
                )}
              </Box>
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
            <RichTextReadOnly
              content={issue.description || "-"}
              extensions={getTipTapExtensions()}
            />
          </Grid>

          {/* Fields */}
          <Grid container spacing={2} mt={1}>
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
