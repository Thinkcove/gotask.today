import React from "react";
import { Box, Grid, Typography, Stack, Avatar } from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DescriptionIcon from "@mui/icons-material/Description";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import CardComponent from "@/app/component/card/cardComponent";
import { IAssetIssues } from "../interface/asset";
import { useAllIssues } from "../services/assetActions";
import MonitorIcon from "@mui/icons-material/Monitor";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import StatusLabelChip from "@/app/component/chip/chip";
import { getIssuesStatusColor } from "@/app/common/constants/asset";

const getInitial = (name: string) => name?.charAt(0).toUpperCase() || "?";

const AssetIssueCards: React.FC = () => {
  const trans = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const { getAll: allissues } = useAllIssues();
  if (!allissues?.length) {
    return (
      <Box textAlign="center" mt={5} px={2}>
        <Typography variant="body1"></Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        py: 2,
        height: "100%",
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto"
      }}
    >
      <Grid container spacing={3}>
        {allissues.map((issue: IAssetIssues) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={issue.id}>
            <CardComponent>
              <Stack spacing={1.2}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: "#ff9800", width: 36, height: 36 }}>
                      {getInitial(String(issue?.reportedDetails?.user_id))}
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {issue.reportedDetails?.user_id}
                    </Typography>
                  </Box>
                  <StatusLabelChip
                    label={issue.status}
                    color={getIssuesStatusColor(issue.status)}
                  />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <MonitorIcon sx={{ fontSize: 18, color: "#741B92" }} />
                    <Typography variant="body2" color="text.secondary">
                      {issue.assetDetails?.modelName || "-"}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <ErrorIcon sx={{ fontSize: 18, color: "#741B92" }} />
                    <Typography variant="body2" color="text.secondary">
                      {issue.issueType || "-"}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Tooltip title={trans("assignedTo")}>
                      <AssignmentIndIcon sx={{ fontSize: 18, color: "#741B92" }} />
                    </Tooltip>
                    <Typography variant="body2" color="text.secondary">
                      {issue.assigned?.user_id || "-"}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <DescriptionIcon sx={{ fontSize: 18, color: "#741B92" }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ maxWidth: 100 }}
                    >
                      {issue.description || "-"}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardComponent>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AssetIssueCards;
