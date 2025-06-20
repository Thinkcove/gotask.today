import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Stack, Avatar, IconButton } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import CardComponent from "@/app/component/card/cardComponent";
import { IAssetIssues } from "../interface/asset";
import { createAssetIssues, useAllIssues, useIssuesById } from "../services/assetActions";
import Tooltip from "@mui/material/Tooltip";
import { getIssuesStatusColor } from "@/app/common/constants/asset";
import EditIcon from "@mui/icons-material/Edit";
import CommonDialog from "@/app/component/dialog/commonDialog";
import FormField from "@/app/component/input/formField";
import { statusOptions } from "../assetConstants";
import StatusIndicator from "@/app/component/status/statusIndicator";
import HistoryIcon from "@mui/icons-material/History";
import IssueHistoryDrawer from "./issuesDrawer";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";

const getInitial = (name: string) => name?.charAt(0).toUpperCase() || "?";

const AssetIssueCards: React.FC = () => {
  const trans = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const { getAll: allissues, mutate: issuesMutate } = useAllIssues();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<IAssetIssues | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string>("");
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const { asset: issueById } = useIssuesById(selectedIssueId ?? "");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const handleEditClick = (issue: IAssetIssues) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setEditOpen(true);
    setSelectedIssueId(issue.id ?? "");
  };

  useEffect(() => {
    if (issueById) {
      setSelectedIssue(issueById);
      setNewStatus(issueById.status);
      setEditOpen(true);
    }
  }, [issueById]);

  const handleStatusUpdate = async () => {
    if (!selectedIssue) return;

    try {
      const response = await createAssetIssues({
        ...selectedIssue,
        status: newStatus
      });
      if (response.success) {
        await issuesMutate();
        setSnackbar({
          open: true,
          message: transasset("issuesupdated"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
        setEditOpen(false);
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

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
                {/* Header */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  rowGap={1}
                >
                  {/* Left: Avatar + Email */}
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

                  {/* Right: Status + Edit icon */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ mt: { xs: 0.5, sm: 0 }, ml: "auto" }}
                  >
                    <StatusIndicator status={issue.status} getColor={getIssuesStatusColor} />

                    <Tooltip title={trans("edit")}>
                      <IconButton size="small" onClick={() => handleEditClick(issue)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

                {/* Body - Key Value */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {trans("issuesType")}{" "}
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
                </Box>
              </Stack>
            </CardComponent>
          </Grid>
        ))}
        <CommonDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSubmit={handleStatusUpdate}
          title={""}
        >
          {/* Custom header row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              pt: 1,
              pb: 1
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {trans("editstatus")}
            </Typography>

            <Box
              onClick={() => setOpenHistoryDrawer(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#741B92",
                cursor: "pointer"
              }}
            >
              <Typography variant="body2" color="inherit">
                {trans("showhistory")}
              </Typography>
              <HistoryIcon fontSize="small" />
            </Box>
          </Box>

          {/* Divider if needed */}
          <Box sx={{ px: 2 }}>
            <FormField
              type="select"
              label={trans("status")}
              placeholder={trans("status")}
              value={newStatus}
              options={statusOptions}
              onChange={(val) => setNewStatus(String(val))}
            />
          </Box>
          {openHistoryDrawer && selectedIssue?.issuesHistory && (
            <IssueHistoryDrawer
              open={openHistoryDrawer}
              onClose={() => setOpenHistoryDrawer(false)}
              history={selectedIssue.issuesHistory}
            />
          )}
        </CommonDialog>
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
