"use client";
import React, { useState } from "react";
import { Box, Grid, CircularProgress, Typography } from "@mui/material";
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
    userIds: userIds.length > 0 ? userIds : [], // ✅ Optional
    showTasks,
    selectedProjects: projectIds.length > 0 ? projectIds : [] // ✅ Optional
  };

  const shouldFetch = !!(fromDate && toDate); // ✅ Only require fromDate & toDate

  const { data, isLoading, isError } = useUserTimeLogReport(payload, shouldFetch);

  const { data: fetchedUserData } = useSWR("fetchuser", fetchUser, {
    revalidateOnFocus: false
  });

  const usersListArray = fetchedUserData?.data;
  if (usersListArray && usersList.length === 0) {
    setUsersList(usersListArray);
  }

  const { data: fetchedProjectData } = useSWR("fetchproject", fetchProject, {
    revalidateOnFocus: false
  });

  const projectsListArray = fetchedProjectData?.data;
  if (projectsListArray && projectsList.length === 0) {
    setProjectsList(projectsListArray);
  }

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
        </Grid>
        <Grid item xs={12} md={9}>
          {isLoading && <CircularProgress />}

          {isError && (
            <Typography color="error">{transreport("error")}</Typography>
          )}

          {!fromDate || !toDate ? ( // ✅ Only check fromDate and toDate
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
