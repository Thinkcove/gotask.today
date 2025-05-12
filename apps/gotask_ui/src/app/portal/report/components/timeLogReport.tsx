"use client";
import React, { useState } from "react";
import { Box, Grid, CircularProgress, Typography } from "@mui/material";
import { useUserTimeLogReport } from "../services/reportService";
import { fetchUser } from "../../task/service/taskAction";
import useSWR from "swr";
import { User } from "../interface/timeLog";
import TimeLogCalendarGrid from "./timeLogCalenderGrid";
import FiltersPanel from "./reportFilterPanel";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoReportImage from "@assets/placeholderImages/noreportlog.svg";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const TimeLogReport = () => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showTasks, setShowTasks] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);

  const { data, isLoading, isError } = useUserTimeLogReport(
    { fromDate, toDate, userIds, showTasks, showProjects },
    !!(fromDate && toDate && userIds.length)
  );

  const { data: fetchedUserData } = useSWR("fetchuser", fetchUser, {
    revalidateOnFocus: false
  });

  const usersListArray = fetchedUserData?.data;

  if (usersListArray && usersList.length === 0) {
    setUsersList(usersListArray);
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
            showProjects={showProjects}
            setShowTasks={setShowTasks}
            setShowProjects={setShowProjects}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          {isLoading && <CircularProgress />}
          {isError && <Typography color="error"> {transreport("error")}</Typography>}
          {!fromDate || !toDate || userIds.length === 0 ? (
            <Grid item xs={12}>
              <EmptyState imageSrc={NoReportImage} message={transreport("loghelper")} />
            </Grid>
          ) : isLoading ? (
            <CircularProgress />
          ) : isError ? (
            <Typography color="error">{transreport("error")}</Typography>
          ) : (
            data && (
              <TimeLogCalendarGrid
                data={data}
                fromDate={fromDate}
                toDate={toDate}
                showTasks={showTasks}
                showProjects={showProjects}
              />
            )
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimeLogReport;
