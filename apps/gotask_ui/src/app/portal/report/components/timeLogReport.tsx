"use client";
import React, { useState } from "react";
import { Box, Grid, CircularProgress, Typography, Button } from "@mui/material";
import { useUserTimeLogReport } from "../services/reportService";
import { fetchProject, fetchUser } from "../../task/service/taskAction";
import useSWR from "swr";
import { User } from "../interface/timeLog";
import TimeLogCalendarGrid from "./timeLogCalenderGrid";
import FiltersPanel from "./reportFilterPanel";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoReportImage from "@assets/placeholderImages/noreportlog.svg";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { Project } from "../../task/interface/taskInterface";

const TimeLogReport = () => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showTasks, setShowTasks] = useState(false);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [projectsList, setProjectsList] = useState<Project[]>([]);

  const payload = {
    fromDate,
    toDate,
    userIds: userIds.length > 0 ? userIds : [],
    showTasks,
    selectedProjects: projectIds.length > 0 ? projectIds : []
  };

  const shouldFetch = !!(fromDate && toDate);

  const { data, isLoading, isError } = useUserTimeLogReport(payload, shouldFetch);

  const { data: fetchedUserData } = useSWR("fetchuser", fetchUser, {
    revalidateOnFocus: false
  });

  const { data: fetchedProjectData } = useSWR("fetchproject", fetchProject, {
    revalidateOnFocus: false
  });

  // Set users list only once when SWR data is fetched
  if (fetchedUserData?.data && usersList.length === 0) {
    setUsersList(fetchedUserData.data);
  }

  // Set project list only once when SWR data is fetched
  if (fetchedProjectData?.data && projectsList.length === 0) {
    setProjectsList(fetchedProjectData.data);
  }

  const handleResetFilters = () => {
    setFromDate("");
    setToDate("");
    setUserIds([]);
    setProjectIds([]);
    setShowTasks(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <FiltersPanel
            fromDate={fromDate}
            toDate={toDate}
            userIds={userIds}
            setFromDate={setFromDate}
            setToDate={setToDate}
            setUserIds={setUserIds}
            usersList={usersList}
            showTasks={showTasks}
            setShowTasks={setShowTasks}
            projectIds={projectIds}
            setProjectIds={setProjectIds}
            projectsList={projectsList}
          />
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleResetFilters}
            fullWidth
          >
            {transreport("reset")}
          </Button>
        </Grid>

        <Grid item xs={12} md={9}>
          {isLoading && <CircularProgress />}

          {isError && (
            <Typography color="error">{transreport("error")}</Typography>
          )}

          {!fromDate || !toDate ? (
            <Grid item xs={12}>
              <EmptyState
                imageSrc={NoReportImage}
                message={transreport("loghelper")}
              />
            </Grid>
          ) : data ? (
            <TimeLogCalendarGrid
              data={data}
              fromDate={fromDate}
              toDate={toDate}
              showTasks={showTasks}
              selectedProjects={projectIds}
            />
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimeLogReport;
