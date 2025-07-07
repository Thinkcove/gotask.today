import React, { useState } from "react";
import { Box, Grid, Typography, Stack, Avatar, IconButton, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import CardComponent from "@/app/component/card/cardComponent";
import { IAssetIssues } from "../interface/asset";
import { useAllIssues } from "../services/assetActions";
import Tooltip from "@mui/material/Tooltip";
import { getIssuesStatusColor } from "@/app/common/constants/asset";
import EditIcon from "@mui/icons-material/Edit";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoAssetsImage from "@assets/placeholderImages/notask.svg";
import { useRouter } from "next/navigation";
import { ArrowForward } from "@mui/icons-material";
import ModuleHeader from "@/app/component/header/moduleHeader";

interface AssetIssueCardsProps {
  searchText: string;
  statusFilter: string[];
}

const getInitial = (name: string) => name?.charAt(0).toUpperCase() || "?";

const AssetIssueCards: React.FC<AssetIssueCardsProps> = ({ searchText, statusFilter }) => {
  const trans = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const router = useRouter();
  const { getAll: allissues, isLoading } = useAllIssues();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const handleEditClick = (issue: IAssetIssues) => {
    router.push(`/asset/editIssues/${issue.id}`);
  };

  const filteredIssues = allissues.filter((issue: IAssetIssues) => {
    const matchesSearch =
      searchText.trim() === "" ||
      issue.status?.toLowerCase().includes(searchText.toLowerCase()) ||
      issue.issueType?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(issue.status);

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <>
        <ModuleHeader name={trans("assets")} />
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

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 2 },
        py: 2,
        height: "100%",
        maxHeight: "calc(100vh - 150px)",
        overflowY: "auto"
      }}
    >
      <Grid container spacing={3}>
        {!allissues?.length || filteredIssues.length === 0 ? (
          <Grid item xs={12}>
            <EmptyState
              imageSrc={NoAssetsImage}
              message={searchText || statusFilter.length ? trans("nodata") : trans("noissues")}
            />
          </Grid>
        ) : (
          filteredIssues.map((issue: IAssetIssues) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={issue.id}>
              <CardComponent
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #fff, #f9f9f9)",
                  transition: "0.3s ease",
                  height: "100%"
                }}
              >
                <Stack spacing={0.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    rowGap={1}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{ bgcolor: "#ff9800", width: 40, height: 40 }}>
                        {getInitial(String(issue?.reportedDetails?.user_id))}
                      </Avatar>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{
                          fontSize: { xs: "0.85rem", sm: "1rem" },
                          wordBreak: "break-word"
                        }}
                      >
                        {issue.reportedDetails?.user_id}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      sx={{ mt: { xs: 0.5, sm: 0 }, ml: "auto" }}
                    >
                      <StatusIndicator status={issue.status} getColor={getIssuesStatusColor} />
                      <Tooltip title={trans("edit")}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditClick(issue)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  <Box sx={{ p: 1.5, borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {trans("issuestypes")}{" "}
                      <Typography component="span" fontWeight={400} color="text.secondary">
                        {issue.issueType || "-"}
                      </Typography>
                    </Typography>

                    <Typography variant="body2" fontWeight={500}>
                      {trans("model")}{" "}
                      <Typography component="span" fontWeight={400} color="text.secondary">
                        {issue.assetDetails?.modelName || "-"}
                      </Typography>
                    </Typography>

                    <Typography variant="body2" fontWeight={500}>
                      {trans("assignedTo")}:{" "}
                      <Typography component="span" fontWeight={400} color="text.secondary">
                        {issue.assigned?.user_id || "-"}
                      </Typography>
                    </Typography>

                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {trans("description")}:{" "}
                      <Tooltip title={issue.description || "-"} placement="top" arrow>
                        <Typography
                          component="span"
                          fontWeight={400}
                          color="text.secondary"
                          noWrap
                          sx={{ maxWidth: "180px", ml: 0.5 }}
                        >
                          {issue.description || "-"}
                        </Typography>
                      </Tooltip>
                    </Typography>
                    <Box display="flex" justifyContent="flex-end">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "#741B92",
                          fontWeight: 500,
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" }
                        }}
                        onClick={() => {
                          router.push(`/asset/viewIssues/${issue.id}`);
                        }}
                      >
                        <Typography sx={{ textTransform: "capitalize", mr: 0.5 }}>
                          {trans("viewdetails")}
                        </Typography>
                        <ArrowForward fontSize="small" />
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </CardComponent>
            </Grid>
          ))
        )}
      </Grid>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default AssetIssueCards;
