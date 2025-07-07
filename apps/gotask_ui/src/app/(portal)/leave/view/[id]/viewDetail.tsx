"use client";
import React from "react";
import { Box, Typography, Grid, IconButton, CircularProgress, Paper, Button } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import ModuleHeader from "@/app/component/header/moduleHeader";
import LabelValueText from "@/app/component/text/labelValueText";
import { useGetLeaveById } from "../../services/leaveAction";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";

const ViewLeave: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data: leave, isLoading } = useGetLeaveById(id as string, true);

  const handleBack = () => router.back();
  const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);

  if (isLoading) {
    return (
      <>
        <ModuleHeader name={transleave("leaves")} />
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

  if (!leave) {
    return (
      <>
        <ModuleHeader name={transleave("leaves")} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh"
          }}
        >
          <Typography variant="h6" color="error">
            {transleave("error")}
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <ModuleHeader name={transleave("leaves")} />
      <Box
        sx={{
          height: "calc(100vh - 64px)",
          overflow: "auto",
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)",
          p: 3
        }}
      >
        <Paper sx={{ p: 4, pb: 8, borderRadius: 4, border: "1px solid #e0e0e0" }}>
          {/* Header */}
          <Grid container alignItems="center" spacing={2} mb={3}>
            <Grid item>
              <IconButton color="primary" onClick={handleBack}>
                <ArrowBack />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Typography variant="h5">{leave.user_name}</Typography>
            </Grid>
            <Grid item xs="auto">
              <IconButton color="primary" onClick={() => router.push(`/leave/edit/${leave.id}`)}>
                <Edit />
              </IconButton>
            </Grid>
          </Grid>

          {/* Leave Details */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText label={transleave("username")} value={leave.user_name || "-"} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText label={transleave("leavetype")} value={leave.leave_type || "-"} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText
                label={transleave("fromdate")}
                value={
                  leave.from_date ? (
                    <FormattedDateTime date={leave.from_date} format={DateFormats.DATE_ONLY} />
                  ) : (
                    "-"
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText
                label={transleave("todate")}
                value={
                  leave.to_date ? (
                    <FormattedDateTime date={leave.to_date} format={DateFormats.DATE_ONLY} />
                  ) : (
                    "-"
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LabelValueText
                label={transleave("reason")}
                value={<div dangerouslySetInnerHTML={{ __html: leave.reasons || "-" }} />}
              />
            </Grid>
          </Grid>

          {/* Close Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{ borderRadius: "30px", textTransform: "none" }}
            >
              {transleave("close")}
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default ViewLeave;
