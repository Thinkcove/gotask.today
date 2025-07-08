import React from "react";
import { Typography, Grid, IconButton, Paper } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import LabelValueText from "@/app/component/text/labelValueText";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { PermissionDetailsProps } from "../interface/interface";
import { formatDate, formatTime } from "@/app/common/utils/dateTimeUtils";
import { Delete } from "@mui/icons-material";

const PermissionDetails: React.FC<PermissionDetailsProps> = ({
  permission,
  onBack,
  handleDeleteClick
}) => {
  const transpermission = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);
  return (
    <Paper sx={{ p: 4, pb: 8, borderRadius: 4, border: "1px solid #e0e0e0" }}>
      {/* Header */}
      <Grid container alignItems="center" spacing={2} mb={3}>
        <Grid item>
          <IconButton color="primary" onClick={onBack}>
            <ArrowBack />
          </IconButton>
        </Grid>
        <Grid item xs>
          <Typography variant="h5">{permission?.user_name}</Typography>
        </Grid>
        <Grid item xs="auto">
          <IconButton color="error" onClick={handleDeleteClick}>
            <Delete />
          </IconButton>
        </Grid>
      </Grid>

      {/* Permission Details */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <LabelValueText
            label={transpermission("permissionapplier")}
            value={permission?.user_name || "-"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <LabelValueText
            label={transpermission("createdat")}
            value={formatDate(permission?.createdAt)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <LabelValueText label={transpermission("date")} value={formatDate(permission?.date)} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <LabelValueText
            label={transpermission("starttime")}
            value={formatTime(permission?.start_time)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <LabelValueText
            label={transpermission("endtime")}
            value={formatTime(permission?.end_time)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PermissionDetails;
