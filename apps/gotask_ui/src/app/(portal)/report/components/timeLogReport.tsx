"use client";

import React, { useState } from "react";
import { Box, Grid, CircularProgress, Typography, Button } from "@mui/material";
import { useUserTimeLogReport } from "../services/reportService";
import { fetchProject, fetchUser } from "../../task/service/taskAction";
import useSWR from "swr";
import { User } from "../interface/timeLog";
import FiltersPanel from "./reportFilterPanel";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoReportImage from "@assets/placeholderImages/noreportlog.svg";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { Project } from "../../task/interface/taskInterface";

import TimeLogCalendarGrid from "./timeLogCalenderGrid";

const getInitialFilters = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("timelog_filters");
    return saved
      ? JSON.parse(saved)
      : {
          fromDate: "",
          toDate: "",
          showTasks: false,
          userIds: [],
          projectIds: []
        };
  }
  return {
    fromDate: "",
    toDate: "",
    showTasks: false,
    userIds: [],
    projectIds: []
  };
};

const TimeLogReport = () => {
  const transreport = useTranslations(LOCALIZATION.TRANSITION.REPORT);
  const [filters, setFilters] = useState(getInitialFilters);
  const isClient = typeof window !== "undefined";

  const {
    data: fetchedUserData,
    error: userError,
    isLoading: isUserLoading
  } = useSWR(isClient ? "fetchuser" : null, fetchUser, {
    revalidateOnFocus: false
  });

  const {
    data: fetchedProjectData,
    error: projectError,
    isLoading: isProjectLoading
  } = useSWR(isClient ? "fetchproject" : null, fetchProject, {
    revalidateOnFocus: false
  });

  const usersList: User[] = fetchedUserData?.data || [];
  const projectsList: Project[] = fetchedProjectData?.data || [];

  const updateFilter = (updated: Partial<typeof filters>) => {
    const newFilters = { ...filters, ...updated };
    setFilters(newFilters);
    if (isClient) {
      localStorage.setItem("timelog_filters", JSON.stringify(newFilters));
    }
  };

  const resetFilters = () => {
    const cleared = {
      fromDate: "",
      toDate: "",
      showTasks: false,
      userIds: [],
      projectIds: []
    };
    setFilters(cleared);
    if (isClient) {
      localStorage.setItem("timelog_filters", JSON.stringify(cleared));
    }
  };

  const payload = {
    fromDate: filters.fromDate,
    toDate: filters.toDate,
    userIds: filters.userIds.length > 0 ? filters.userIds : [],
    showTasks: filters.showTasks,
    selectedProjects: filters.projectIds.length > 0 ? filters.projectIds : []
  };

  const shouldFetch = filters.fromDate !== "" && filters.toDate !== "";

  const {
    data: reportData,
    isLoading: isReportLoading,
    isError: isReportError
  } = useUserTimeLogReport(payload, shouldFetch);

  if (userError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{transreport("errorFetchingUsers")}</Typography>
      </Box>
    );
  }

  if (projectError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{transreport("errorFetchingProjects")}</Typography>
      </Box>
    );
  }

  if (isUserLoading || isProjectLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          {isClient && (
            <FiltersPanel
              fromDate={filters.fromDate}
              toDate={filters.toDate}
              userIds={filters.userIds}
              setFromDate={(val) => updateFilter({ fromDate: val })}
              setToDate={(val) => updateFilter({ toDate: val })}
              setUserIds={(val) => updateFilter({ userIds: val })}
              usersList={usersList}
              showTasks={filters.showTasks}
              setShowTasks={(val) => updateFilter({ showTasks: val })}
              projectIds={filters.projectIds}
              setProjectIds={(val) => updateFilter({ projectIds: val })}
              projectsList={projectsList}
            />
          )}

          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={resetFilters}
            fullWidth
          >
            {transreport("reset")}
          </Button>
        </Grid>

        <Grid item xs={12} md={9}>
          {isReportLoading && <CircularProgress />}

          {isReportError && <Typography color="error">{transreport("error")}</Typography>}

          {!filters.fromDate || !filters.toDate ? (
            <Grid item xs={12}>
              <EmptyState imageSrc={NoReportImage} message={transreport("loghelper")} />
            </Grid>
          ) : reportData ? (
            <TimeLogCalendarGrid
              data={reportData}
              fromDate={filters.fromDate}
              toDate={filters.toDate}
              showTasks={filters.showTasks}
              selectedProjects={filters.projectIds}
            />
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimeLogReport;
