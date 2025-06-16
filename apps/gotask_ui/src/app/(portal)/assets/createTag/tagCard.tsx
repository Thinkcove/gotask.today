"use client";
import React, { useState } from "react";
import { Avatar, Box, Grid, Typography, Stack, Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useAllTags } from "../services/assetActions";
import CardComponent from "@/app/component/card/cardComponent";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MonitorIcon from "@mui/icons-material/Monitor";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import StatusLabelChip from "@/app/component/chip/chip";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";
import NoTasksImage from "@assets/placeholderImages/notask.svg";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface UserDetails {
  user_id: string;
}

interface AssetDetails {
  modelName: string;
  deviceName: string;
}

interface IPrviouslyUsedBy {
  user_id: string;
}

export interface Tag {
  id: string;
  userId: string;
  assetId: string;
  erk?: string;
  previouslyUsedBy?: string;
  actionType: string;
  assetDetails?: AssetDetails;
  previouslyUsedByUser?: IPrviouslyUsedBy;
  userDetails: UserDetails;
}

const getInitial = (email: string) => email?.charAt(0).toUpperCase() || "?";

const TagCards: React.FC = () => {
  const trans = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const { getAll: tags } = useAllTags();

  const [showErkId, setShowErkId] = useState<string | null>(null);
  const [erkDialogOpen, setErkDialogOpen] = useState(false);
  const [selectedErk, setSelectedErk] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "assigned":
        return "success";
      case "returned":
        return "warning";
      case "serviced":
        return "info";
      default:
        return "default";
    }
  };

  const handleOpenErkDialog = (erk: string) => {
    setSelectedErk(erk);
    setErkDialogOpen(true);
  };

  const handleCloseErkDialog = () => {
    setErkDialogOpen(false);
    setSelectedErk(null);
  };

  if (!tags?.length) {
    return (
      <Box textAlign="center" mt={5} px={2}>
        <EmptyState
          imageSrc={!tags ? NoSearchResultsImage : NoTasksImage}
          message={!tags ? trans("nodata") : trans("nodata")}
        />
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
        {tags.map((tag: Tag) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={tag.id}>
            <CardComponent>
              <Stack spacing={2}>
                {/* Top Section */}
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <Avatar
                    sx={{
                      bgcolor: "#741B92",
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      fontSize: { xs: "1rem", sm: "1.2rem" }
                    }}
                  >
                    {getInitial(tag.userDetails.user_id)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} noWrap>
                      {tag.userDetails.user_id}
                    </Typography>
                  </Box>
                </Stack>

                <Divider />

                {/* Info Section */}
                <Stack spacing={1}>
                  <Grid container spacing={1}>
                    {/* Row 1: Model Name + Action Type */}
                    <Grid item xs={6}>
                      <Box display="flex" alignItems="center">
                        <MonitorIcon sx={{ fontSize: 18, color: "#741B92", mr: 1 }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {tag.assetDetails?.modelName || trans("noassetdetails")}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box display="flex" alignItems="center">
                        <StatusLabelChip
                          label={tag.actionType}
                          color={getStatusColor(tag.actionType)}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    {/* Row 2: Previously Used By + ERK */}
                    {tag.previouslyUsedByUser?.user_id && (
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                          <SupervisorAccountIcon sx={{ fontSize: 18, color: "#741B92", mr: 1 }} />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {tag.previouslyUsedByUser.user_id}
                          </Typography>
                        </Box>
                      </Grid>
                    )}

                    {tag.erk && (
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                          <EnhancedEncryptionIcon sx={{ fontSize: 18, color: "#741B92", mr: 1 }} />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ letterSpacing: 2, fontSize: "1rem", mr: 1 }}
                          >
                            ••••••••
                          </Typography>
                          <Box
                            onClick={() => handleOpenErkDialog(tag.erk!)}
                            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                          >
                            <VisibilityIcon sx={{ fontSize: 20, color: "#741B92" }} />
                          </Box>
                          <Dialog
                            open={erkDialogOpen}
                            onClose={handleCloseErkDialog}
                            maxWidth="xs"
                            fullWidth
                          >
                            <DialogTitle sx={{ fontWeight: 600, color: "#741B92" }}>
                              Encrypted Key
                            </DialogTitle>
                            <DialogContent>
                              <Typography sx={{ wordBreak: "break-word", fontSize: "1rem" }}>
                                {selectedErk}
                              </Typography>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleCloseErkDialog} color="primary">
                                Close
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Stack>
              </Stack>
            </CardComponent>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TagCards;
