"use client";
import React, { useState } from "react";
import { Avatar, Box, Grid, Typography, Chip, Stack, Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useAllTags } from "../services/assetActions";
import CardComponent from "@/app/component/card/cardComponent";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MonitorIcon from "@mui/icons-material/Monitor";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";

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

  const toggleErkVisibility = (id: string) => {
    setShowErkId((prev) => (prev === id ? null : id));
  };

  if (!tags?.length) {
    return (
      <Box textAlign="center" mt={5} px={2}>
        <Typography variant="body1">{trans("notagsavailable")}</Typography>
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
                <Box>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <MonitorIcon sx={{ fontSize: 18, color: "#741B92", mr: 1 }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.85rem" }}
                      noWrap
                    >
                      {tag.assetDetails?.modelName || trans("noassetdetails")}
                    </Typography>
                  </Box>
                  {tag.previouslyUsedByUser?.user_id && (
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <SupervisorAccountIcon sx={{ fontSize: 18, color: "#741B92", mr: 1 }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {tag.previouslyUsedByUser.user_id}
                      </Typography>
                    </Box>
                  )}

                  {tag.erk && (
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <EnhancedEncryptionIcon sx={{ fontSize: 18, color: "#741B92", mr: 1 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ letterSpacing: 2, fontSize: "1rem", mr: 1 }}
                      >
                        {showErkId === tag.id ? tag.erk : "••••••••"}
                      </Typography>

                      <Box
                        onClick={() => toggleErkVisibility(tag.id)}
                        sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                      >
                        {showErkId === tag.id ? (
                          <VisibilityOffIcon sx={{ fontSize: 20, color: "#741B92" }} />
                        ) : (
                          <VisibilityIcon sx={{ fontSize: 20, color: "#741B92" }} />
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Status Tag */}
                <Box display="flex" justifyContent="flex-start">
                  <Chip
                    label={tag.actionType}
                    color={tag.actionType === "Assigned" ? "success" : "warning"}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                  />
                </Box>
              </Stack>
            </CardComponent>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TagCards;
