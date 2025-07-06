import React from "react";
import { Box, Typography, Grid, IconButton, Paper, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import LabelValueText from "@/app/component/text/labelValueText";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

interface PermissionData {
  _id: string;
  user_id: string;
  user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  comments: string[];
  id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PermissionDetailsProps {
  permission: PermissionData;
  onBack: () => void;
}

const PermissionDetails: React.FC<PermissionDetailsProps> = ({ permission, onBack }) => {
  const transpermishion = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

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
      </Grid>

      {/* Permission Details */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <LabelValueText
            label={transpermishion("username")}
            value={permission?.user_name || "-"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <LabelValueText label={transpermishion("date")} value={formatDate(permission?.date)} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <LabelValueText
            label={transpermishion("starttime")}
            value={formatTime(permission?.start_time)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <LabelValueText
            label={transpermishion("endtime")}
            value={formatTime(permission?.end_time)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <LabelValueText
            label={transpermishion("createdat")}
            value={formatDate(permission?.createdAt)}
          />
        </Grid>

        {permission?.comments && permission?.comments.length > 0 && (
          <Grid item xs={12}>
            <LabelValueText
              label={transpermishion("comments")}
              value={
                <Box>
                  {permission?.comments.map((comment: string, index: number) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                      {comment}
                    </Typography>
                  ))}
                </Box>
              }
            />
          </Grid>
        )}
      </Grid>

      {/* Close Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{ borderRadius: "30px", textTransform: "none" }}
        >
          {transpermishion("close")}
        </Button>
      </Box>
    </Paper>
  );
};

export default PermissionDetails;
